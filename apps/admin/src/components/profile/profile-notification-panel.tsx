import {Switch} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import type {AdminProfile} from "@/types/profile-types";

const ROWS: {key: keyof AdminProfile["notifications"]; label: () => string; sub: () => string}[] = [
  {key: "email", label: m["profile.notif_email"], sub: m["profile.notif_email_sub"]},
  {key: "push", label: m["profile.notif_push"], sub: m["profile.notif_push_sub"]},
  {key: "sms", label: m["profile.notif_sms"], sub: m["profile.notif_sms_sub"]},
];

interface NotificationPanelProps {
  profile: AdminProfile;
  saving: boolean;
  onChange: (prefs: AdminProfile["notifications"]) => void;
}

/** Notification tab — per-channel preference switches that persist immediately. */
export function ProfileNotificationPanel({profile, saving, onChange}: NotificationPanelProps) {
  return (
    <section className="w-[651px] rounded-2xl border border-grey-200 bg-white p-6">
      <h2 className="text-lg leading-[1.4] font-semibold text-black">{m["profile.notif_title"]()}</h2>
      <p className="pt-1 pb-2 text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{m["profile.notif_subtitle"]()}</p>
      {ROWS.map(({key, label, sub}) => (
        <div key={key} className="flex items-center justify-between gap-6 border-b border-grey-200 py-4 last:border-b-0">
          <div>
            <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{label()}</p>
            <p className="pt-0.5 text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{sub()}</p>
          </div>
          <Switch
            checked={profile.notifications[key]}
            disabled={saving}
            onCheckedChange={(checked) => onChange({...profile.notifications, [key]: checked})}
            aria-label={label()}
          />
        </div>
      ))}
    </section>
  );
}
