import type {PlatformSettings, SettingsService} from "@/types/settings-types";
import {mockDelay} from "./mock-http";

const OPTIONS = {
  timezones: ["Africa/Lagos (WAT)", "Africa/Accra (GMT)", "Europe/London (GMT/BST)", "UTC"],
  dateFormats: ["DD/MM/YY", "DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"],
};

let settingsStore: PlatformSettings = {
  general: {platformName: "Alvo", timezone: "Africa/Lagos (WAT)", dateFormat: "DD/MM/YY"},
  courierPayout: {dueBufferDays: 3, autoWithholdFlagged: true, dateFormat: "DD/MM/YY"},
  notifications: {adminActions: true, payoutCycleApproaching: true, nodeDowntime: true, payoutProcessed: true, criticalSystem: false},
  security: {sessionTimeoutMinutes: 30, enforceTwoFactor: true, passwordExpiryDays: 30, maxLoginAttempts: 5},
};

/** In-memory stand-in for the platform settings API while it does not exist. */
export const mockSettingsService: SettingsService = {
  getSettings: async () => {
    await mockDelay();
    return {settings: structuredClone(settingsStore), options: OPTIONS};
  },

  updateSettings: async (settings) => {
    await mockDelay();
    settingsStore = structuredClone(settings);
    return structuredClone(settingsStore);
  },
};
