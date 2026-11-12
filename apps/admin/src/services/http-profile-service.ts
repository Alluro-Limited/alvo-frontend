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
  permissions?: string[];
  totpEnabled?: boolean;
  lastActiveAt?: string;
  createdAt: string;
}

interface ApiSessionRow {
  id: string;
  userAgent?: string;
  ip?: string;
  createdAt?: string;
  lastUsedAt?: string;
  current?: boolean;
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
  status: p.status === "ADMIN_STATUS_SUSPENDED" ? "suspended" : "active",
  memberSince: p.createdAt,
  lastLogin: p.lastActiveAt ?? "",
  passwordChangedDaysAgo: 0,
  twoFactorEnabled: p.totpEnabled ?? false,
  timezone: "",
  dateFormat: "",
  notifications: {email: true, push: true, sms: false},
  sessions: sessions.map((s) => ({
    id: s.id,
    device: s.userAgent ?? "",
    location: s.ip ?? "",
    lastActive: s.lastUsedAt ?? "",
    current: s.current ?? false,
  })),
});

const getMe = () => apiClient.get("v1/admin/me").json<ApiAdminProfile>();

/**
 * Profile against `v1/admin/me` (+PUT name only), `me/password`, and `me/sessions`.
 * The wire profile has no phone/timezone/date-format/notification-pref fields, and
 * 2FA toggling rides the TOTP enroll/confirm pair the screens don't drive yet —
 * `updateProfile`/`toggleTwoFactor`/`updateNotificationPrefs` only write what exists.
 */
export const httpProfileService: ProfileService = {
  getProfile: async () => {
    const [me, sessions] = await Promise.all([
      getMe(),
      apiClient
        .get("v1/admin/me/sessions")
        .json<{sessions?: ApiSessionRow[]}>()
        .catch(() => ({sessions: [] as ApiSessionRow[]})),
    ]);
    return toProfile(me, sessions.sessions ?? []);
  },
  getProfileOptions: async () => ({timezones: [], dateFormats: []}),
  updateProfile: async (input) => {
    const res = await apiClient.put("v1/admin/me", {json: {firstName: input.firstName, lastName: input.lastName}}).json<ApiAdminProfile>();
    return toProfile(res, []);
  },
  changePassword: async (input) => {
    await apiClient.post("v1/admin/me/password", {json: {currentPassword: input.currentPassword, newPassword: input.newPassword}});
    return {id: "password"};
  },
  updateNotificationPrefs: async () => {
    const me = await getMe();
    return toProfile(me, []);
  },
  toggleTwoFactor: async () => {
    const me = await getMe();
    return toProfile(me, []);
  },
  revokeSession: async (sessionId) => {
    await apiClient.delete(`v1/admin/me/sessions/${sessionId}`);
    return {id: sessionId};
  },
};
