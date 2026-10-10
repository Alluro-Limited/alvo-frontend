import * as v from "valibot";
import {apiClient} from "@/services/api-client";
import type {ProfileService} from "@/types/profile-types";

const RoleSchema = v.picklist(["super_admin", "operational_admin", "finance_admin", "support_admin", "viewer"]);

const ProfileSchema = v.object({
  id: v.string(),
  firstName: v.string(),
  lastName: v.string(),
  email: v.string(),
  phone: v.string(),
  role: RoleSchema,
  roleLabel: v.string(),
  status: v.picklist(["active", "suspended"]),
  memberSince: v.string(),
  lastLogin: v.string(),
  passwordChangedDaysAgo: v.number(),
  twoFactorEnabled: v.boolean(),
  timezone: v.string(),
  dateFormat: v.string(),
  notifications: v.object({email: v.boolean(), push: v.boolean(), sms: v.boolean()}),
  sessions: v.array(v.object({id: v.string(), device: v.string(), location: v.string(), lastActive: v.string(), current: v.boolean()})),
});

const OptionsSchema = v.object({timezones: v.array(v.string()), dateFormats: v.array(v.string())});

/** Ky adapter for the signed-in admin's profile API — active when `VITE_API_URL` is set. */
export const httpProfileService: ProfileService = {
  getProfile: async () => v.parse(ProfileSchema, await apiClient.get("profile").json()),

  getProfileOptions: async () => v.parse(OptionsSchema, await apiClient.get("profile/options").json()),

  updateProfile: async (input) => v.parse(ProfileSchema, await apiClient.put("profile", {json: input}).json()),

  changePassword: async (input) => v.parse(v.object({id: v.string()}), await apiClient.post("profile/password", {json: input}).json()),

  updateNotificationPrefs: async (prefs) => v.parse(ProfileSchema, await apiClient.put("profile/notifications", {json: prefs}).json()),

  toggleTwoFactor: async (enabled) => v.parse(ProfileSchema, await apiClient.post("profile/two-factor", {json: {enabled}}).json()),

  revokeSession: async (sessionId) => v.parse(v.object({id: v.string()}), await apiClient.delete(`profile/sessions/${sessionId}`).json()),
};
