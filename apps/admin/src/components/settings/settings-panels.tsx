import {m} from "@/paraglide/messages";
import type {PlatformSettings, SettingsOptions} from "@/types/settings-types";
import {SettingInput, SettingNumber, SettingRow, SettingSelect, SettingSwitch, SettingsPanel} from "./settings-panel";

export interface PanelProps {
  draft: PlatformSettings;
  options: SettingsOptions;
  saving: boolean;
  failed: boolean;
  onPatch: (patch: Partial<PlatformSettings>) => void;
  onSave: () => void;
}

type General = PlatformSettings["general"];
type Payout = PlatformSettings["courierPayout"];
type Notifications = PlatformSettings["notifications"];
type Security = PlatformSettings["security"];

const patch = <K extends keyof PlatformSettings>(onPatch: PanelProps["onPatch"], section: K, value: PlatformSettings[K]) =>
  onPatch({[section]: value});

/** General — platform identity and regional preferences. */
export function GeneralPanel({draft, options, saving, failed, onPatch, onSave}: PanelProps) {
  const set = (key: keyof General) => (value: string) => patch(onPatch, "general", {...draft.general, [key]: value});
  return (
    <SettingsPanel
      title={m["settings.general_title"]()}
      subtitle={m["settings.general_subtitle"]()}
      saving={saving}
      failed={failed}
      onSave={onSave}
    >
      <SettingRow label={m["settings.platform_name"]()} subtitle={m["settings.platform_name_sub"]()}>
        <SettingInput
          id="set-name"
          label={m["settings.platform_name"]()}
          value={draft.general.platformName}
          onChange={set("platformName")}
        />
      </SettingRow>
      <SettingRow label={m["settings.timezone"]()} subtitle={m["settings.timezone_sub"]()}>
        <SettingSelect id="set-tz" value={draft.general.timezone} options={options.timezones} onChange={set("timezone")} />
      </SettingRow>
      <SettingRow label={m["settings.date_format"]()} subtitle={m["settings.date_format_sub"]()}>
        <SettingSelect id="set-df" value={draft.general.dateFormat} options={options.dateFormats} onChange={set("dateFormat")} />
      </SettingRow>
    </SettingsPanel>
  );
}

/** Courier Payout — payment cycle and threshold configuration. */
export function PayoutPanel({draft, options, saving, failed, onPatch, onSave}: PanelProps) {
  const set =
    <K extends keyof Payout>(key: K) =>
    (value: Payout[K]) =>
      patch(onPatch, "courierPayout", {...draft.courierPayout, [key]: value});
  return (
    <SettingsPanel
      title={m["settings.payout_title"]()}
      subtitle={m["settings.payout_subtitle"]()}
      saving={saving}
      failed={failed}
      onSave={onSave}
    >
      <SettingRow label={m["settings.due_buffer"]()} subtitle={m["settings.due_buffer_sub"]()}>
        <SettingNumber
          id="set-buffer"
          label={m["settings.due_buffer"]()}
          value={draft.courierPayout.dueBufferDays}
          suffix={m["settings.due_buffer_suffix"]()}
          onChange={set("dueBufferDays")}
        />
      </SettingRow>
      <SettingRow label={m["settings.auto_withhold"]()} subtitle={m["settings.auto_withhold_sub"]()}>
        <SettingSwitch
          label={m["settings.auto_withhold"]()}
          checked={draft.courierPayout.autoWithholdFlagged}
          onChange={set("autoWithholdFlagged")}
        />
      </SettingRow>
      <SettingRow label={m["settings.date_format"]()} subtitle={m["settings.date_format_sub"]()}>
        <SettingSelect
          id="set-payout-df"
          value={draft.courierPayout.dateFormat}
          options={options.dateFormats}
          onChange={set("dateFormat")}
        />
      </SettingRow>
    </SettingsPanel>
  );
}

const NOTIF_ROWS: {key: keyof Notifications; label: () => string; sub: () => string}[] = [
  {key: "adminActions", label: m["settings.notif_admin_actions"], sub: m["settings.notif_admin_actions_sub"]},
  {key: "payoutCycleApproaching", label: m["settings.notif_payout_cycle"], sub: m["settings.notif_payout_cycle_sub"]},
  {key: "nodeDowntime", label: m["settings.notif_node_downtime"], sub: m["settings.notif_node_downtime_sub"]},
  {key: "payoutProcessed", label: m["settings.notif_payout_processed"], sub: m["settings.notif_payout_processed_sub"]},
  {key: "criticalSystem", label: m["settings.notif_critical"], sub: m["settings.notif_critical_sub"]},
];

/** Notification — which alerts admins and couriers receive. */
export function NotificationPanel({draft, saving, failed, onPatch, onSave}: PanelProps) {
  const set = (key: keyof Notifications) => (value: boolean) => patch(onPatch, "notifications", {...draft.notifications, [key]: value});
  return (
    <SettingsPanel
      title={m["settings.notification_title"]()}
      subtitle={m["settings.notification_subtitle"]()}
      saving={saving}
      failed={failed}
      onSave={onSave}
    >
      {NOTIF_ROWS.map(({key, label, sub}) => (
        <SettingRow key={key} label={label()} subtitle={sub()}>
          <SettingSwitch label={label()} checked={draft.notifications[key]} onChange={set(key)} />
        </SettingRow>
      ))}
    </SettingsPanel>
  );
}

/** Security — authentication and access control policies. */
export function SecurityPanel({draft, saving, failed, onPatch, onSave}: PanelProps) {
  const set =
    <K extends keyof Security>(key: K) =>
    (value: Security[K]) =>
      patch(onPatch, "security", {...draft.security, [key]: value});
  return (
    <SettingsPanel
      title={m["settings.security_title"]()}
      subtitle={m["settings.security_subtitle"]()}
      saving={saving}
      failed={failed}
      onSave={onSave}
    >
      <SettingRow label={m["settings.session_timeout"]()} subtitle={m["settings.session_timeout_sub"]()}>
        <SettingNumber
          id="set-timeout"
          label={m["settings.session_timeout"]()}
          value={draft.security.sessionTimeoutMinutes}
          suffix={m["settings.session_timeout_suffix"]()}
          onChange={set("sessionTimeoutMinutes")}
        />
      </SettingRow>
      <SettingRow label={m["settings.enforce_2fa"]()} subtitle={m["settings.enforce_2fa_sub"]()}>
        <SettingSwitch label={m["settings.enforce_2fa"]()} checked={draft.security.enforceTwoFactor} onChange={set("enforceTwoFactor")} />
      </SettingRow>
      <SettingRow label={m["settings.password_expiry"]()} subtitle={m["settings.password_expiry_sub"]()}>
        <SettingNumber
          id="set-expiry"
          label={m["settings.password_expiry"]()}
          value={draft.security.passwordExpiryDays}
          suffix={m["settings.password_expiry_suffix"]()}
          onChange={set("passwordExpiryDays")}
        />
      </SettingRow>
      <SettingRow label={m["settings.max_attempts"]()} subtitle={m["settings.max_attempts_sub"]()}>
        <SettingNumber
          id="set-attempts"
          label={m["settings.max_attempts"]()}
          value={draft.security.maxLoginAttempts}
          suffix={m["settings.max_attempts_suffix"]()}
          onChange={set("maxLoginAttempts")}
        />
      </SettingRow>
    </SettingsPanel>
  );
}

/** Data & Privacy — no Figma content for this tab yet; explicit placeholder panel. */
export function PrivacyPanel() {
  return (
    <section className="w-[651px] rounded-2xl border border-grey-200 bg-white p-6">
      <h2 className="text-lg leading-[1.4] font-semibold text-black">{m["settings.nav_privacy"]()}</h2>
      <p className="pt-1 text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{m["settings.privacy_empty"]()}</p>
    </section>
  );
}
