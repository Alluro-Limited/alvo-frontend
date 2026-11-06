import {apiClient} from "@/services/api-client";
import type {AdminProfile, ProfileService} from "@/types/profile-types";
import type {AdminRole} from "@/types/admins-types";

interface ApiAdminProfile {
  id: string;
  code: string;
  name: string;
  email: string;
  role: string;
  status: string;
  totpEnabled: boolean;
  lastActiveAt?: string;
  createdAt: string;
}

interface ApiSessionRow {
  id: string;
  device: string;
  location: string;
  lastActiveAt: string;
  current: boolean;
}

const nameParts = (name: string) => {
  const [first = "", ...rest] = name.split(" ");
  return {firstName: first, lastName: rest.join(" ")};
};

const toProfile = (p: ApiAdminProfile, sessions: ApiSessionRow[]): AdminProfile => ({
  id: p.id,
  ...nameParts(p.name),
  email: p.email,
  phone: "",
  role: (p.role as AdminRole) ?? "viewer",
  roleLabel: p.role,
  status: p.status === "SUSPENDED" ? "suspended" : "active",
  memberSince: p.createdAt,
  lastLogin: p.lastActiveAt ?? "",
  passwordChangedDaysAgo: 0,
  twoFactorEnabled: p.totpEnabled,
  timezone: "",
  dateFormat: "",
  notifications: {email: true, push: true, sms: false},
  sessions: sessions.map((s) => ({id: s.id, device: s.device, location: s.location, lastActive: s.lastActiveAt, current: s.current})),
});

/**
 * Profile against `v1/admin/me` (+PUT name only), `me/password`, and `me/sessions`.
 * The wire profile has no phone/timezone/date-format/notification-pref fields, and
 * 2FA toggling rides the TOTP enroll/confirm pair the screens don't drive yet —
 * `updateProfile`/`toggleTwoFactor`/`updateNotificationPrefs` only write what exists.
 */
export const httpProfileService: ProfileService = {
  getProfile: async () => {
    const [me, sessions] = await Promise.all([
      apiClient.get("v1/admin/me").json<{admin: ApiAdminProfile}>(),
      apiClient
        .get("v1/admin/me/sessions")
        .json<{sessions: ApiSessionRow[]}>()
        .catch(() => ({sessions: [] as ApiSessionRow[]})),
    ]);
    return toProfile(me.admin, sessions.sessions);
  },
  getProfileOptions: async () => ({timezones: [], dateFormats: []}),
  updateProfile: async (input) => {
    await apiClient.put("v1/admin/me", {json: {firstName: input.firstName, lastName: input.lastName}});
    const res = await apiClient.get("v1/admin/me").json<{admin: ApiAdminProfile}>();
    return toProfile(res.admin, []);
  },
  changePassword: async (input) => {
    await apiClient.post("v1/admin/me/password", {json: {currentPassword: input.currentPassword, newPassword: input.newPassword}});
    return {id: "password"};
  },
  updateNotificationPrefs: async () => {
    const me = await apiClient.get("v1/admin/me").json<{admin: ApiAdminProfile}>();
    return toProfile(me.admin, []);
  },
  toggleTwoFactor: async () => {
    const me = await apiClient.get("v1/admin/me").json<{admin: ApiAdminProfile}>();
    return toProfile(me.admin, []);
  },
  revokeSession: async (sessionId) => {
    await apiClient.delete(`v1/admin/me/sessions/${sessionId}`);
    return {id: sessionId};
  },
};
