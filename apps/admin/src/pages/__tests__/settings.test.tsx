import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {settingsService} from "@/services/settings-service";
import {renderRoute} from "@/test/render-route";
import type {SettingsResponse} from "@/types/settings-types";
import {SettingsPage} from "../settings";

vi.mock("@/services/settings-service", () => ({
  settingsService: {
    getSettings: vi.fn(),
    updateSettings: vi.fn(),
  },
}));

const getSettings = vi.mocked(settingsService.getSettings);
const updateSettings = vi.mocked(settingsService.updateSettings);

const RESPONSE: SettingsResponse = {
  settings: {
    general: {platformName: "Alvo", timezone: "Africa/Lagos", dateFormat: "DD/MM/YYYY"},
    courierPayout: {dueBufferDays: 3, autoWithholdFlagged: true, dateFormat: "DD/MM/YYYY"},
    notifications: {adminActions: true, payoutCycleApproaching: true, nodeDowntime: true, payoutProcessed: false, criticalSystem: true},
    security: {sessionTimeoutMinutes: 30, enforceTwoFactor: true, passwordExpiryDays: 90, maxLoginAttempts: 5},
  },
  options: {
    timezones: ["Africa/Lagos", "UTC"],
    dateFormats: ["DD/MM/YYYY", "MM/DD/YYYY"],
  },
};

beforeEach(() => {
  vi.clearAllMocks();
  getSettings.mockResolvedValue(RESPONSE);
  updateSettings.mockResolvedValue(RESPONSE.settings);
});

describe("SettingsPage", () => {
  it("renders the nav and the general settings panel", async () => {
    renderRoute(SettingsPage, "/settings");
    expect(await screen.findByText("settings.general_title")).toBeTruthy();
    expect(screen.getByText("settings.nav_general")).toBeTruthy();
    expect(screen.getByText("settings.nav_security")).toBeTruthy();
    expect(screen.getByText("settings.nav_privacy")).toBeTruthy();
    expect((screen.getByRole("textbox", {name: "settings.platform_name"}) as HTMLInputElement).value).toBe("Alvo");
  });

  it("switches to the security panel with its rows", async () => {
    renderRoute(SettingsPage, "/settings");
    await screen.findByText("settings.general_title");
    fireEvent.click(screen.getByText("settings.nav_security"));
    expect(await screen.findByText("settings.security_title")).toBeTruthy();
    expect(screen.getByText("settings.enforce_2fa")).toBeTruthy();
    expect(screen.getByText("settings.max_attempts")).toBeTruthy();
  });

  it("switches to the courier payout, notification, and privacy panels", async () => {
    renderRoute(SettingsPage, "/settings");
    await screen.findByText("settings.general_title");
    fireEvent.click(screen.getByText("settings.nav_payout"));
    expect(await screen.findByText("settings.payout_title")).toBeTruthy();
    fireEvent.click(screen.getByText("settings.nav_notification"));
    expect(await screen.findByText("settings.notification_title")).toBeTruthy();
    fireEvent.click(screen.getByText("settings.nav_privacy"));
    expect(await screen.findByText("settings.privacy_empty")).toBeTruthy();
  });

  it("saves an edited field through the service and shows the toast", async () => {
    renderRoute(SettingsPage, "/settings");
    await screen.findByText("settings.general_title");
    const input = screen.getByRole("textbox", {name: "settings.platform_name"});
    fireEvent.change(input, {target: {value: "Alvo Express"}});
    fireEvent.click(screen.getByRole("button", {name: "settings.save"}));
    await waitFor(() =>
      expect(updateSettings).toHaveBeenCalledWith(
        expect.objectContaining({general: expect.objectContaining({platformName: "Alvo Express"})})
      )
    );
    expect(await screen.findByText("settings.toast_saved")).toBeTruthy();
  });

  it("toggles a security switch and saves", async () => {
    renderRoute(SettingsPage, "/settings");
    await screen.findByText("settings.general_title");
    fireEvent.click(screen.getByText("settings.nav_security"));
    await screen.findByText("settings.security_title");
    const toggle = screen.getByRole("switch", {name: "settings.enforce_2fa"});
    expect(toggle.getAttribute("aria-checked")).toBe("true");
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-checked")).toBe("false");
    fireEvent.click(screen.getByRole("button", {name: "settings.save"}));
    await waitFor(() =>
      expect(updateSettings).toHaveBeenCalledWith(expect.objectContaining({security: expect.objectContaining({enforceTwoFactor: false})}))
    );
  });

  it("shows the retryable error state", async () => {
    getSettings.mockRejectedValueOnce(new Error("boom"));
    renderRoute(SettingsPage, "/settings");
    expect(await screen.findByTestId("settings-error")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "settings.retry"}));
    await waitFor(() => expect(getSettings).toHaveBeenCalledTimes(2));
  });
});
