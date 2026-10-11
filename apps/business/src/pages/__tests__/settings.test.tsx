import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {settingsService} from "@/services/settings-service";
import {shipmentService} from "@/services/shipment-service";
import {renderRoute} from "@/test/render-route";
import type {AccountSettings} from "@/types/settings-types";
import {SettingsPage} from "../settings";

vi.mock("@/services/settings-service", () => ({
  settingsService: {
    getSettings: vi.fn(),
    updateUserProfile: vi.fn(),
    updateBusinessProfile: vi.fn(),
    updateNotifications: vi.fn(),
    changePassword: vi.fn(),
  },
}));

vi.mock("@/services/shipment-service", () => ({
  shipmentService: {getLockers: vi.fn(), createBatch: vi.fn()},
}));

const getSettings = vi.mocked(settingsService.getSettings);
const updateUserProfile = vi.mocked(settingsService.updateUserProfile);
const updateNotifications = vi.mocked(settingsService.updateNotifications);
const changePassword = vi.mocked(settingsService.changePassword);

const SETTINGS: AccountSettings = {
  user: {firstName: "Quadri", lastName: "Olanrewaju", phone: "08114749646", email: "olatunji@alvo.com"},
  business: {
    businessName: "Alvo Delivery",
    businessType: "logistics",
    cacNumber: "RC123456",
    cacVerified: true,
    originLockerId: "locker-2",
  },
  notifications: {
    email: {batchSubmitted: true, courierDispatched: true, deliveryFailed: true, weeklySummary: true, lowBalance: true},
    sms: {courierEta: true, batchDelivered: true, lowBalance: true},
  },
};

const renderSettings = () => {
  vi.mocked(shipmentService.getLockers).mockResolvedValue([
    {id: "locker-1", name: "Lekki Hub - PR14"},
    {id: "locker-2", name: "Surulere Hub - L04"},
  ]);
  return renderRoute(SettingsPage, "/settings");
};

const switchTab = async (name: string) => {
  fireEvent.click(await screen.findByRole("tab", {name}));
};

describe("SettingsPage", () => {
  beforeEach(() => {
    getSettings.mockReset();
    updateUserProfile.mockReset();
    updateNotifications.mockReset();
    changePassword.mockReset();
    getSettings.mockResolvedValue(structuredClone(SETTINGS));
  });

  it("shows the user profile fields filled from the loaded settings", async () => {
    renderSettings();
    expect(((await screen.findByLabelText("settings.first_name")) as HTMLInputElement).value).toBe("Quadri");
    expect((screen.getByLabelText("settings.last_name") as HTMLInputElement).value).toBe("Olanrewaju");
    expect((screen.getByLabelText("settings.email") as HTMLInputElement).value).toBe("olatunji@alvo.com");
  });

  it("validates the email before saving the user profile", async () => {
    updateUserProfile.mockResolvedValue(SETTINGS.user);
    renderSettings();
    const email = (await screen.findByLabelText("settings.email")) as HTMLInputElement;
    fireEvent.change(email, {target: {value: "not-an-email"}});
    fireEvent.click(screen.getByRole("button", {name: "settings.save_changes"}));
    expect(screen.getByText("settings.errors.email")).toBeTruthy();
    expect(updateUserProfile).not.toHaveBeenCalled();
  });

  it("saves the edited user profile", async () => {
    updateUserProfile.mockResolvedValue(SETTINGS.user);
    renderSettings();
    const firstName = (await screen.findByLabelText("settings.first_name")) as HTMLInputElement;
    fireEvent.change(firstName, {target: {value: "Ada"}});
    fireEvent.click(screen.getByRole("button", {name: "settings.save_changes"}));
    await waitFor(() => expect(updateUserProfile).toHaveBeenCalled());
    expect(updateUserProfile.mock.calls[0][0]).toMatchObject({firstName: "Ada"});
  });

  it("renders the business profile with verified CAC and editable selects", async () => {
    renderSettings();
    await switchTab("settings.tab_business");
    expect(await screen.findByText("settings.business_title")).toBeTruthy();
    expect((screen.getByLabelText("settings.business_name") as HTMLInputElement).disabled).toBe(true);
    expect(screen.getByText("settings.verified")).toBeTruthy();
    expect((screen.getByLabelText("settings.business_type") as HTMLSelectElement).value).toBe("logistics");
  });

  it("toggles a notification preference and saves it", async () => {
    updateNotifications.mockResolvedValue(SETTINGS.notifications);
    renderSettings();
    await switchTab("settings.tab_notifications");
    const toggle = await screen.findByRole("switch", {name: "settings.notify.email_weekly_title"});
    expect(toggle.getAttribute("aria-checked")).toBe("true");
    fireEvent.click(toggle);
    await waitFor(() => expect(updateNotifications).toHaveBeenCalled());
    expect(updateNotifications.mock.calls[0][0].email.weeklySummary).toBe(false);
  });

  it("rejects mismatched new passwords and wrong current passwords", async () => {
    changePassword.mockRejectedValue(new Error("unauthorized"));
    renderSettings();
    await switchTab("settings.tab_security");

    const [current, next, confirm] = [
      (await screen.findByLabelText("settings.current_password")) as HTMLInputElement,
      screen.getByLabelText("settings.new_password") as HTMLInputElement,
      screen.getByLabelText("settings.confirm_password") as HTMLInputElement,
    ];
    fireEvent.change(current, {target: {value: "Password123!"}});
    fireEvent.change(next, {target: {value: "Newpass123!"}});
    fireEvent.change(confirm, {target: {value: "Different1!"}});
    fireEvent.click(screen.getByRole("button", {name: "settings.save_password"}));
    expect(screen.getByText("settings.errors.password_mismatch")).toBeTruthy();
    expect(changePassword).not.toHaveBeenCalled();
  });

  it("saves a valid new password and shows the success banner", async () => {
    changePassword.mockResolvedValue(undefined);
    renderSettings();
    await switchTab("settings.tab_security");

    fireEvent.change(await screen.findByLabelText("settings.current_password"), {target: {value: "Password123!"}});
    fireEvent.change(screen.getByLabelText("settings.new_password"), {target: {value: "Newpass123!"}});
    fireEvent.change(screen.getByLabelText("settings.confirm_password"), {target: {value: "Newpass123!"}});
    fireEvent.click(screen.getByRole("button", {name: "settings.save_password"}));

    expect(await screen.findByText("settings.password_saved")).toBeTruthy();
    expect(changePassword.mock.calls[0][0]).toEqual({currentPassword: "Password123!", newPassword: "Newpass123!"});
  });
});
