/** Platform-wide configuration grouped the way the Settings tabs present it. */
export interface PlatformSettings {
  general: {
    platformName: string;
    timezone: string;
    dateFormat: string;
  };
  courierPayout: {
    dueBufferDays: number;
    autoWithholdFlagged: boolean;
    dateFormat: string;
  };
  notifications: {
    adminActions: boolean;
    payoutCycleApproaching: boolean;
    nodeDowntime: boolean;
    payoutProcessed: boolean;
    criticalSystem: boolean;
  };
  security: {
    sessionTimeoutMinutes: number;
    enforceTwoFactor: boolean;
    passwordExpiryDays: number;
    maxLoginAttempts: number;
  };
}

/** Options the timezone/date-format selects offer — backend-supplied. */
export interface SettingsOptions {
  timezones: string[];
  dateFormats: string[];
}

export interface SettingsResponse {
  settings: PlatformSettings;
  options: SettingsOptions;
}

export interface SettingsService {
  getSettings: () => Promise<SettingsResponse>;
  updateSettings: (settings: PlatformSettings) => Promise<PlatformSettings>;
}
