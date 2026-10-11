import {Switch} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import {useUpdateNotificationsMutation} from "@/queries/use-settings-queries";
import type {EmailNotificationPrefs, NotificationPrefs, SmsNotificationPrefs} from "@/types/settings-types";
import {SettingsCard} from "./settings-card";

type EmailKey = keyof EmailNotificationPrefs;
type SmsKey = keyof SmsNotificationPrefs;

interface ToggleRowProps {
  title: string;
  subtitle: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/** Label/description pair with the shared Switch on the right. */
function ToggleRow({title, subtitle, checked, onChange}: ToggleRowProps) {
  return (
    <div className="flex items-center gap-2.5 py-4">
      <div className="flex flex-1 flex-col gap-0.5">
        <p className="text-sm leading-[1.4] font-medium text-[#070d17]">{title}</p>
        <p className="text-xs leading-[1.4] tracking-[0.12px] text-[#070d17] opacity-50">{subtitle}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={title} />
    </div>
  );
}

const EMAIL_ROWS: {key: EmailKey; title: () => string; subtitle: () => string}[] = [
  {key: "batchSubmitted", title: m["settings.notify.email_batch_title"], subtitle: m["settings.notify.email_batch_sub"]},
  {key: "courierDispatched", title: m["settings.notify.email_courier_title"], subtitle: m["settings.notify.email_courier_sub"]},
  {key: "deliveryFailed", title: m["settings.notify.email_failed_title"], subtitle: m["settings.notify.email_failed_sub"]},
  {key: "weeklySummary", title: m["settings.notify.email_weekly_title"], subtitle: m["settings.notify.email_weekly_sub"]},
  {key: "lowBalance", title: m["settings.notify.email_balance_title"], subtitle: m["settings.notify.email_balance_sub"]},
];

const SMS_ROWS: {key: SmsKey; title: () => string; subtitle: () => string}[] = [
  {key: "courierEta", title: m["settings.notify.sms_courier_title"], subtitle: m["settings.notify.sms_courier_sub"]},
  {key: "batchDelivered", title: m["settings.notify.sms_delivered_title"], subtitle: m["settings.notify.sms_delivered_sub"]},
  {key: "lowBalance", title: m["settings.notify.sms_balance_title"], subtitle: m["settings.notify.sms_balance_sub"]},
];

interface NotificationsPanelProps {
  prefs: NotificationPrefs;
}

/** "Notifications" tab — email and SMS preference toggles, saved immediately. */
export function NotificationsPanel({prefs}: NotificationsPanelProps) {
  const mutation = useUpdateNotificationsMutation();

  const update = <K extends "email" | "sms", F extends keyof NotificationPrefs[K]>(channel: K, field: F, value: boolean) => {
    mutation.mutate({...prefs, [channel]: {...prefs[channel], [field]: value}});
  };

  return (
    <SettingsCard title={m["settings.notifications_title"]()} subtitle={m["settings.notifications_sub"]()}>
      <section className="flex flex-col">
        <h3 className="text-sm leading-[1.4] font-medium text-[#070d17]">{m["settings.email_notifications"]()}</h3>
        <div className="mt-2.5 flex flex-col divide-y divide-grey-200">
          {EMAIL_ROWS.map((row) => (
            <ToggleRow
              key={row.key}
              title={row.title()}
              subtitle={row.subtitle()}
              checked={prefs.email[row.key]}
              onChange={(checked) => update("email", row.key, checked)}
            />
          ))}
        </div>
      </section>
      <section className="mt-6 flex flex-col border-t border-grey-300 pt-6">
        <h3 className="text-sm leading-[1.4] font-medium text-[#070d17]">{m["settings.sms_notifications"]()}</h3>
        <div className="mt-2.5 flex flex-col divide-y divide-grey-200">
          {SMS_ROWS.map((row) => (
            <ToggleRow
              key={row.key}
              title={row.title()}
              subtitle={row.subtitle()}
              checked={prefs.sms[row.key]}
              onChange={(checked) => update("sms", row.key, checked)}
            />
          ))}
        </div>
      </section>
    </SettingsCard>
  );
}
