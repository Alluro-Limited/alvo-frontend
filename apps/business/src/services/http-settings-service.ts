import {getSme} from "@/services/session";
import type {AccountSettings, NotificationPrefs, SettingsService} from "@/types/settings-types";

const DEFAULT_PREFS: NotificationPrefs = {
  email: {batchSubmitted: true, courierDispatched: true, deliveryFailed: true, weeklySummary: true, lowBalance: true},
  sms: {courierEta: false, batchDelivered: true, lowBalance: true},
};

const UNSUPPORTED = "settings updates are not supported by the API yet";

/**
 * Settings against the session's SME snapshot — the API has no `/v1/sme/me`, no profile
 * update, no SME notification-prefs, and no change-password for SME principals, so the
 * mutating methods throw until those endpoints exist.
 */
export const httpSettingsService: SettingsService = {
  getSettings: async (): Promise<AccountSettings> => {
    const sme = getSme();
    return {
      user: {firstName: "", lastName: "", phone: "", email: sme?.workEmail ?? ""},
      business: {
        businessName: sme?.businessName ?? "",
        businessType: "",
        cacNumber: null,
        cacVerified: false,
        originLockerId: null,
      },
      notifications: DEFAULT_PREFS,
    };
  },
  updateUserProfile: async (_input) => {
    throw new Error(UNSUPPORTED);
  },
  updateBusinessProfile: async () => {
    throw new Error(UNSUPPORTED);
  },
  updateNotifications: async () => {
    throw new Error(UNSUPPORTED);
  },
  changePassword: async () => {
    throw new Error(UNSUPPORTED);
  },
};
