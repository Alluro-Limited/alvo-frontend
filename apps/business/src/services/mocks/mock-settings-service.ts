import type {AccountSettings, NotificationPrefs, SettingsService} from "@/types/settings-types";
import {MOCK_AUTH} from "./mock-auth-service";
import {mockDelay, mockHttpError} from "./mock-http";
import {mockSession} from "./mock-session";

const UNAUTHORIZED = 401;

const DEFAULT_SETTINGS: AccountSettings = {
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

/** Per-session settings, keyed by the signed-in email so edits persist across navigation. */
const settingsByEmail = new Map<string, AccountSettings>();

function settingsFor(email: string): AccountSettings {
  const existing = settingsByEmail.get(email);
  if (existing) return existing;
  const user = {...DEFAULT_SETTINGS.user, firstName: mockSession.firstName ?? DEFAULT_SETTINGS.user.firstName, email};
  const settings: AccountSettings = {
    user,
    business: {...DEFAULT_SETTINGS.business},
    notifications: structuredClone(DEFAULT_SETTINGS.notifications),
  };
  settingsByEmail.set(email, settings);
  return settings;
}

/** In-memory settings backend while the API does not exist. Never ships when `VITE_API_URL` is set. */
export const mockSettingsService: SettingsService = {
  getSettings: async () => {
    await mockDelay();
    return structuredClone(settingsFor(mockSession.email ?? "demo@alvo.com"));
  },
  updateUserProfile: async (input) => {
    await mockDelay();
    const settings = settingsFor(mockSession.email ?? "demo@alvo.com");
    settings.user = {...input};
    return settings.user;
  },
  updateBusinessProfile: async (input) => {
    await mockDelay();
    const settings = settingsFor(mockSession.email ?? "demo@alvo.com");
    settings.business = {...settings.business, ...input};
    return settings.business;
  },
  updateNotifications: async (prefs: NotificationPrefs) => {
    await mockDelay(300);
    const settings = settingsFor(mockSession.email ?? "demo@alvo.com");
    settings.notifications = structuredClone(prefs);
    return settings.notifications;
  },
  changePassword: async ({currentPassword}) => {
    await mockDelay();
    if (currentPassword !== MOCK_AUTH.password) throw mockHttpError("settings/password", UNAUTHORIZED);
  },
};
