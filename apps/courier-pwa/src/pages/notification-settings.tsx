import {useNavigate} from "@tanstack/react-router";
import {PrefRow} from "@/components/notifications/pref-row";
import {WizardHeader} from "@/components/sign-up/wizard-header";
import {m} from "@/paraglide/messages";
import {useNotificationPrefsQuery, useSetNotificationPrefMutation} from "@/queries/use-earnings-queries";

/** Notification settings — per-category push toggles launched from the account menu. */
export function NotificationSettingsPage() {
  const navigate = useNavigate();
  const prefs = useNotificationPrefsQuery();
  const setPref = useSetNotificationPrefMutation();

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[430px] bg-white px-6 pt-[max(24px,env(safe-area-inset-top))] pb-[max(24px,env(safe-area-inset-bottom))]">
      <WizardHeader step={0} onBack={() => void navigate({to: "/profile"})} />
      <h1 className="mt-9 text-[24px] leading-[30px] font-medium tracking-[-0.01em]">{m["notif.title"]()}</h1>
      <div className="mt-6">
        {prefs.isPending || !prefs.data ? (
          <div className="flex flex-col gap-4 py-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-[37px] animate-pulse rounded-[8px] bg-grey-100" />
            ))}
          </div>
        ) : (
          <div>
            <PrefRow
              label={m["notif.jobs"]()}
              description={m["notif.jobs_desc"]()}
              checked={prefs.data.jobs}
              onChange={(enabled) => setPref.mutate({key: "jobs", enabled})}
            />
            <PrefRow
              label={m["notif.pay"]()}
              description={m["notif.pay_desc"]()}
              checked={prefs.data.payments}
              onChange={(enabled) => setPref.mutate({key: "payments", enabled})}
            />
            <PrefRow
              label={m["notif.admin"]()}
              description={m["notif.admin_desc"]()}
              checked={prefs.data.admin}
              onChange={(enabled) => setPref.mutate({key: "admin", enabled})}
            />
          </div>
        )}
      </div>
    </main>
  );
}
