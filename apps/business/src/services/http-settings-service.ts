import {apiClient} from "@/services/api-client";
import type {
  AccountSettings,
  BusinessProfile,
  BusinessProfileUpdate,
  NotificationPrefs,
  SettingsService,
  UserProfile,
} from "@/types/settings-types";

/** Settings over the real backend. Endpoint paths are placeholders until the API exists. */
export const httpSettingsService: SettingsService = {
  getSettings: async () => apiClient.get("settings").json<AccountSettings>(),
  updateUserProfile: async (input) => apiClient.patch("settings/profile", {json: input}).json<UserProfile>(),
  updateBusinessProfile: async (input: BusinessProfileUpdate) =>
    apiClient.patch("settings/business", {json: input}).json<BusinessProfile>(),
  updateNotifications: async (prefs) => apiClient.patch("settings/notifications", {json: prefs}).json<NotificationPrefs>(),
  changePassword: async (input) => {
    await apiClient.post("settings/password", {json: input});
  },
};
