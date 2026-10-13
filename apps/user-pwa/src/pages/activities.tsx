import {useState} from "react";
import {ActivityChips} from "@/components/activities/activity-chips";
import {ActivityFeed} from "@/components/activities/activity-feed";
import {CancelDialog} from "@/components/activities/cancel-dialog";
import {CancelledScreen} from "@/components/activities/cancelled-screen";
import {UpgradeSheet} from "@/components/activities/upgrade-sheet";
import type {ActivityFilter} from "@/types/activity-types";
import {useActivitiesQuery} from "@/queries/use-activity-queries";
import {m} from "@/paraglide/messages";

/** The Activities tab — title, status-filter chips, and the day-grouped activity feed. */
export function ActivitiesPage() {
  const [filter, setFilter] = useState<ActivityFilter>("all");
  const [upgradeId, setUpgradeId] = useState<string | null>(null);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelled, setCancelled] = useState(false);
  const query = useActivitiesQuery();

  if (cancelled) return <CancelledScreen onBack={() => setCancelled(false)} />;

  return (
    <main className="flex h-dvh w-full flex-col gap-6 overflow-hidden bg-white px-6 pt-[60px]">
      <h1 className="text-[32px] font-bold leading-[1.1] tracking-[-0.32px] text-foreground">{m["act.title"]()}</h1>
      <ActivityChips value={filter} onChange={setFilter} />
      {query.isLoading ? (
        <div className="flex flex-1 flex-col gap-4" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-[12px] bg-grey-100" />
          ))}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pb-[100px]">
          <ActivityFeed items={query.data ?? []} filter={filter} onUpgrade={(item) => setUpgradeId(item.id)} />
        </div>
      )}
      {upgradeId ? (
        <UpgradeSheet
          deliveryId={upgradeId}
          onClose={() => setUpgradeId(null)}
          onCancel={() => {
            setCancelId(upgradeId);
            setUpgradeId(null);
          }}
        />
      ) : null}
      {cancelId ? (
        <CancelDialog
          deliveryId={cancelId}
          onClose={() => setCancelId(null)}
          onCancelled={() => {
            setCancelId(null);
            setCancelled(true);
          }}
        />
      ) : null}
    </main>
  );
}
