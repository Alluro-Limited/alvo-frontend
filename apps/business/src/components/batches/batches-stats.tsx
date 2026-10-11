import statBriefcaseUrl from "@/assets/stat-briefcase.svg";
import statNairaUrl from "@/assets/stat-naira.svg";
import statRouteUrl from "@/assets/stat-route.svg";
import statTimeUrl from "@/assets/stat-time.svg";
import {m} from "@/paraglide/messages";
import {StatCard} from "@/components/dashboard/stat-card";
import {formatNaira} from "@/lib/format-naira";
import type {BatchListStats} from "@/types/batch-types";

const ICON_BG = "bg-primary-100/30";

/** The four headline metrics above the batches table. */
export function BatchesStats({stats}: {stats: BatchListStats}) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard
        label={m["batches.stat_batches"]()}
        icon={statBriefcaseUrl}
        iconBg={ICON_BG}
        value={stats.totalBatches}
        sub={m["batches.stat_batches_sub"]({
          active: stats.activeBatches,
          complete: stats.completeBatches,
          draft: stats.draftBatches,
        })}
      />
      <StatCard
        label={m["batches.stat_shipments"]()}
        icon={statTimeUrl}
        iconBg={ICON_BG}
        value={formatNaira(stats.totalShipments)}
        sub={m["batches.stat_shipments_sub"]()}
      />
      <StatCard
        label={m["batches.stat_locker"]()}
        icon={statRouteUrl}
        iconBg={ICON_BG}
        value={stats.topLocker?.code ?? "—"}
        sub={stats.topLocker ? m["batches.stat_locker_sub"]({area: stats.topLocker.area, deliveries: stats.topLocker.deliveries}) : "—"}
      />
      <StatCard
        label={m["batches.stat_spend"]()}
        icon={statNairaUrl}
        iconBg={ICON_BG}
        value={`₦${formatNaira(stats.totalSpend)}`}
        sub={m["batches.stat_spend_sub"]({avg: formatNaira(stats.avgPerShipment)})}
      />
    </div>
  );
}
