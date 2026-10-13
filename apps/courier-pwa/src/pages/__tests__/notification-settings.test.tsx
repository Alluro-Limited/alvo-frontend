import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {accountService} from "@/services/account-service";
import {renderRoute} from "@/test/render-route";
import type {NotificationPrefs} from "@/types/earnings-types";
import {NotificationSettingsPage} from "../notification-settings";

vi.mock("@/services/account-service", () => ({
  accountService: {
    getNotificationPrefs: vi.fn(),
    setNotificationPref: vi.fn(),
  },
}));

const getNotificationPrefs = vi.mocked(accountService.getNotificationPrefs);
const setNotificationPref = vi.mocked(accountService.setNotificationPref);

let prefs: NotificationPrefs;

describe("NotificationSettingsPage", () => {
  beforeEach(() => {
    prefs = {jobs: true, payments: false, admin: true};
    getNotificationPrefs.mockReset().mockImplementation(async () => ({...prefs}));
    setNotificationPref.mockReset().mockImplementation(async (key, enabled) => {
      prefs = {...prefs, [key]: enabled};
    });
  });

  it("shows the three notification categories with their descriptions", async () => {
    renderRoute(NotificationSettingsPage, "/notification-settings");
    expect(await screen.findByText("notif.jobs")).toBeTruthy();
    expect(screen.getByText("notif.jobs_desc")).toBeTruthy();
    expect(screen.getByText("notif.pay")).toBeTruthy();
    expect(screen.getByText("notif.pay_desc")).toBeTruthy();
    expect(screen.getByText("notif.admin")).toBeTruthy();
    expect(screen.getByText("notif.admin_desc")).toBeTruthy();
    expect(screen.getAllByRole("switch")).toHaveLength(3);
  });

  it("turning a category off calls the service and flips the switch", async () => {
    renderRoute(NotificationSettingsPage, "/notification-settings");
    const toggle = await screen.findByRole("switch", {name: "notif.jobs"});
    expect(toggle.getAttribute("aria-checked")).toBe("true");
    fireEvent.click(toggle);
    await waitFor(() => expect(setNotificationPref).toHaveBeenCalledWith("jobs", false));
    await waitFor(() => expect(toggle.getAttribute("aria-checked")).toBe("false"));
  });

  it("turning a category on calls the service with enabled", async () => {
    renderRoute(NotificationSettingsPage, "/notification-settings");
    const toggle = await screen.findByRole("switch", {name: "notif.pay"});
    fireEvent.click(toggle);
    await waitFor(() => expect(setNotificationPref).toHaveBeenCalledWith("payments", true));
    await waitFor(() => expect(toggle.getAttribute("aria-checked")).toBe("true"));
  });
});
