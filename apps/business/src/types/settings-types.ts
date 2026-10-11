export type SettingsTab = "user" | "business" | "notifications" | "security";

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface BusinessProfile {
  /** Read-only in the design — set at signup and not editable here. */
  businessName: string;
  businessType: string;
  /** Read-only; shows a "Verified" badge once `cacVerified`. */
  cacNumber: string | null;
  cacVerified: boolean;
  originLockerId: string | null;
}

export interface EmailNotificationPrefs {
  batchSubmitted: boolean;
  courierDispatched: boolean;
  deliveryFailed: boolean;
  weeklySummary: boolean;
  lowBalance: boolean;
}

export interface SmsNotificationPrefs {
  courierEta: boolean;
  batchDelivered: boolean;
  lowBalance: boolean;
}

export interface NotificationPrefs {
  email: EmailNotificationPrefs;
  sms: SmsNotificationPrefs;
}

export interface AccountSettings {
  user: UserProfile;
  business: BusinessProfile;
  notifications: NotificationPrefs;
}

export type BusinessProfileUpdate = Pick<BusinessProfile, "businessType" | "originLockerId">;

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface SettingsService {
  getSettings: () => Promise<AccountSettings>;
  updateUserProfile: (input: UserProfile) => Promise<UserProfile>;
  updateBusinessProfile: (input: BusinessProfileUpdate) => Promise<BusinessProfile>;
  updateNotifications: (prefs: NotificationPrefs) => Promise<NotificationPrefs>;
  changePassword: (input: ChangePasswordInput) => Promise<void>;
}
