import {API_ERROR_CODES} from "@/lib/api-errors";
import type {AdminProfile, ProfileService} from "@/types/profile-types";
import {mockDelay, mockHttpError} from "./mock-http";

const OPTIONS = {
  timezones: ["Africa/Lagos (WAT)", "Africa/Accra (GMT)", "Europe/London (GMT/BST)", "UTC"],
  dateFormats: ["DD/MM/YY", "DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"],
};

let profileStore: AdminProfile = {
  id: "ADM-001",
  firstName: "Dayo",
  lastName: "Ogunseye",
  email: "dayo@Alvo.ng",
  phone: "+234 801 234 5678",
  role: "super_admin",
  roleLabel: "Super Admin",
  status: "active",
  memberSince: "October 1, 2024",
  lastLogin: "May 24, 2025, 3:42 PM",
  passwordChangedDaysAgo: 45,
  twoFactorEnabled: true,
  timezone: "Africa/Lagos (WAT)",
  dateFormat: "DD/MM/YY",
  notifications: {email: true, push: true, sms: false},
  sessions: [
    {id: "ses-1", device: "Chrome · macOS", location: "Lagos, Nigeria · 105.112.48.XX", lastActive: "", current: true},
    {id: "ses-2", device: "Safari · iPhone", location: "Lagos, Nigeria · 105.112.48.XX", lastActive: "2 hours ago", current: false},
    {id: "ses-3", device: "Chrome · Windows", location: "Lagos, Nigeria · 105.112.52.XX", lastActive: "2 hours ago", current: false},
  ],
};

/** In-memory stand-in for the signed-in admin's profile API while it does not exist. */
export const mockProfileService: ProfileService = {
  getProfile: async () => {
    await mockDelay();
    return structuredClone(profileStore);
  },

  getProfileOptions: async () => {
    await mockDelay();
    return OPTIONS;
  },

  updateProfile: async (input) => {
    await mockDelay();
    profileStore = {...profileStore, ...input};
    return structuredClone(profileStore);
  },

  changePassword: async (input) => {
    await mockDelay();
    if (input.currentPassword.length < 4) {
      throw mockHttpError("profile/password", API_ERROR_CODES.BAD_REQUEST, {currentPassword: "incorrect"});
    }
    profileStore = {...profileStore, passwordChangedDaysAgo: 0};
    return {id: profileStore.id};
  },

  updateNotificationPrefs: async (prefs) => {
    await mockDelay();
    profileStore = {...profileStore, notifications: {...prefs}};
    return structuredClone(profileStore);
  },

  toggleTwoFactor: async (enabled) => {
    await mockDelay();
    profileStore = {...profileStore, twoFactorEnabled: enabled};
    return structuredClone(profileStore);
  },

  revokeSession: async (sessionId) => {
    await mockDelay();
    const index = profileStore.sessions.findIndex((session) => session.id === sessionId && !session.current);
    if (index < 0) throw mockHttpError(`profile/sessions/${sessionId}`, API_ERROR_CODES.NOT_FOUND);
    profileStore = {...profileStore, sessions: profileStore.sessions.filter((session) => session.id !== sessionId)};
    return {id: sessionId};
  },
};
