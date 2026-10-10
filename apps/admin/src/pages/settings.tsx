import {useState} from "react";
import {Button} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import {useSettingsQuery, useUpdateSettingsMutation} from "@/queries/use-settings-query";
import {AppToast} from "@/components/app-toast";
import {SettingsNav, type SettingsTab} from "@/components/settings/settings-nav";
import {GeneralPanel, NotificationPanel, PayoutPanel, PrivacyPanel, SecurityPanel} from "@/components/settings/settings-panels";
import {useSettingsDraft} from "@/components/settings/use-settings-draft";

/** System → Settings — left sub-nav with per-section cards; each card edits its slice of the settings payload. */
export function SettingsPage() {
  const [tab, setTab] = useState<SettingsTab>("general");
  const [toast, setToast] = useState(false);
  const query = useSettingsQuery();
  const update = useUpdateSettingsMutation();
  const {draft, patch, reset} = useSettingsDraft(query.data?.settings);

  const onSave =
    draft !== null
      ? () =>
          update.mutate(draft, {
            onSuccess: () => {
              reset();
              setToast(true);
            },
          })
      : () => {};

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl leading-[1.3] font-bold text-black">{m["settings.title"]()}</h1>
      {query.isPending && <SettingsSkeleton />}
      {query.isError && <SettingsError retrying={query.isRefetching} onRetry={() => void query.refetch()} />}
      {draft !== null && query.data && (
        <div className="flex items-start gap-6">
          <SettingsNav tab={tab} onTab={setTab} />
          <SettingsPanels
            tab={tab}
            props={{draft, options: query.data.options, saving: update.isPending, failed: update.isError, onPatch: patch, onSave}}
          />
        </div>
      )}
      {toast && <AppToast message={m["settings.toast_saved"]()} variant="success" onDismiss={() => setToast(false)} />}
    </div>
  );
}

function SettingsPanels({tab, props}: {tab: SettingsTab; props: Parameters<typeof GeneralPanel>[0]}) {
  if (tab === "general") return <GeneralPanel {...props} />;
  if (tab === "payout") return <PayoutPanel {...props} />;
  if (tab === "notification") return <NotificationPanel {...props} />;
  if (tab === "security") return <SecurityPanel {...props} />;
  return <PrivacyPanel />;
}

function SettingsSkeleton() {
  return (
    <div className="flex items-start gap-6" aria-busy="true">
      <div className="flex w-[245px] flex-col gap-2">
        {Array.from({length: 5}, (_, index) => (
          <div key={index} className="h-11 animate-pulse rounded-lg bg-grey-100" />
        ))}
      </div>
      <div className="h-[420px] w-[651px] animate-pulse rounded-2xl border border-grey-200 bg-grey-100" />
    </div>
  );
}

function SettingsError({retrying, onRetry}: {retrying: boolean; onRetry: () => void}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-grey-300 bg-white py-20"
      data-testid="settings-error"
    >
      <p className="text-sm font-medium text-black">{m["settings.error_title"]()}</p>
      <Button variant="outline" isLoading={retrying} onClick={onRetry} className="h-9 px-4">
        {m["settings.retry"]()}
      </Button>
    </div>
  );
}
