import {apiClient} from "@/services/api-client";
import {getStepUpToken} from "@/services/step-up";
import type {PlatformSettings, SettingsService} from "@/types/settings-types";

interface ApiSetting {
  key?: string;
  value?: string | number | boolean;
  version?: number;
}

interface ApiSettingsResponse {
  settings?: ApiSetting[];
}

type SettingValue = string | number | boolean | undefined;

const bool = (v: SettingValue) => v === true;
const num = (v: SettingValue) => Number(v ?? 0);
const str = (v: SettingValue) => (typeof v === "string" ? v : "");

/**
 * Settings against `v1/admin/settings` — the wire is a flat `{key, value, version}` list;
 * the screen's grouped shape is a view over it. Updates send each changed key with the
 * version the last GET returned (optimistic concurrency), and `options` isn't a wire
 * concept — the selects keep static lists.
 */
export const httpSettingsService: SettingsService = {
  getSettings: async () => {
    const res = await apiClient.get("v1/admin/settings").json<ApiSettingsResponse>();
    const map = new Map((res.settings ?? []).map((s) => [s.key ?? "", s]));
    const get = (key: string): SettingValue => map.get(key)?.value;
    const settings: PlatformSettings = {
      general: {
        platformName: str(get("general.platform_name")),
        timezone: str(get("general.timezone")),
        dateFormat: str(get("general.date_format")),
      },
      courierPayout: {
        dueBufferDays: num(get("payouts.payment_due_buffer_days")),
        autoWithholdFlagged: bool(get("payouts.auto_withhold_flagged")),
        dateFormat: str(get("general.date_format")),
      },
      notifications: {
        adminActions: bool(get("notifications.admin_actions")),
        payoutCycleApproaching: bool(get("notifications.payout_cycle_approaching")),
        nodeDowntime: bool(get("notifications.node_downtime_alerts")),
        payoutProcessed: bool(get("notifications.payout_processed_sms")),
        criticalSystem: bool(get("notifications.critical_system_alerts_sms")),
      },
      security: {
        sessionTimeoutMinutes: num(get("security.session_timeout_minutes")),
        enforceTwoFactor: bool(get("security.enforce_two_factor")),
        passwordExpiryDays: num(get("security.password_expiry_days")),
        maxLoginAttempts: num(get("security.max_login_attempts")),
      },
    };
    return {settings, options: {timezones: [], dateFormats: []}};
  },
  updateSettings: async (settings) => {
    const current = await apiClient.get("v1/admin/settings").json<ApiSettingsResponse>();
    const version = new Map((current.settings ?? []).map((s) => [s.key ?? "", s.version ?? 0]));
    const change = (key: string, value: string | number | boolean) => ({key, value, version: version.get(key) ?? 0});
    const changes = [
      change("general.platform_name", settings.general.platformName),
      change("general.timezone", settings.general.timezone),
      change("general.date_format", settings.general.dateFormat),
      change("payouts.payment_due_buffer_days", settings.courierPayout.dueBufferDays),
      change("payouts.auto_withhold_flagged", settings.courierPayout.autoWithholdFlagged),
      change("notifications.admin_actions", settings.notifications.adminActions),
      change("notifications.payout_cycle_approaching", settings.notifications.payoutCycleApproaching),
      change("notifications.node_downtime_alerts", settings.notifications.nodeDowntime),
      change("notifications.payout_processed_sms", settings.notifications.payoutProcessed),
      change("notifications.critical_system_alerts_sms", settings.notifications.criticalSystem),
      change("security.session_timeout_minutes", settings.security.sessionTimeoutMinutes),
      change("security.enforce_two_factor", settings.security.enforceTwoFactor),
      change("security.password_expiry_days", settings.security.passwordExpiryDays),
      change("security.max_login_attempts", settings.security.maxLoginAttempts),
    ];
    await apiClient.patch("v1/admin/settings", {json: {changes}, headers: {"X-Step-Up": await getStepUpToken()}});
    return settings;
  },
};
