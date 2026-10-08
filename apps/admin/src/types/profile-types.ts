import type {AdminRole} from "./admins-types";

/** One active session row in the Session tab. */
export interface ProfileSession {
  id: string;
  /** e.g. "Chrome · macOS". */
  device: string;
  /** e.g. "Lagos, Nigeria · 105.112.48.XX". */
  location: string;
  /** Display string, e.g. "2 hours ago" — empty for the current session. */
  lastActive: string;
  /** The session this browser is using — renders "Active Now" and can't be revoked. */
  current: boolean;
}

/** The signed-in admin's profile payload. */
export interface AdminProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: AdminRole;
  roleLabel: string;
  status: "active" | "suspended";
  /** Display dates for the profile card. */
  memberSince: string;
  lastLogin: string;
  passwordChangedDaysAgo: number;
  twoFactorEnabled: boolean;
  timezone: string;
  dateFormat: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  sessions: ProfileSession[];
}

export interface UpdateProfileInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  timezone: string;
  dateFormat: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface ProfileOptions {
  timezones: string[];
  dateFormats: string[];
}

export interface ProfileService {
  getProfile: () => Promise<AdminProfile>;
  getProfileOptions: () => Promise<ProfileOptions>;
  updateProfile: (input: UpdateProfileInput) => Promise<AdminProfile>;
  changePassword: (input: ChangePasswordInput) => Promise<{id: string}>;
  updateNotificationPrefs: (prefs: AdminProfile["notifications"]) => Promise<AdminProfile>;
  toggleTwoFactor: (enabled: boolean) => Promise<AdminProfile>;
  revokeSession: (sessionId: string) => Promise<{id: string}>;
}
