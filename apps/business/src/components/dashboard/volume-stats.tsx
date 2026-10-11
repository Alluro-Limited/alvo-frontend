import {m} from "@/paraglide/messages";
import {formatNaira} from "@/lib/format-naira";
import type {DashboardStats} from "@/types/dashboard-types";
import statBatchesUrl from "@/assets/stat-batches.svg";
import statLockerUrl from "@/assets/stat-locker.svg";
import statShipmentsUrl from "@/assets/stat-shipments.svg";
import statSpendUrl from "@/assets/stat-spend.svg";
import {StatCard} from "./stat-card";

const TEAL_ICON_BG = "bg-primary-100/20";

function SpendValue({amount}: {amount: number}) {
  return (
    <>
      <span className="text-lg leading-[1.4] font-normal tracking-[0.18px]">₦</span>
      {formatNaira(amount)}
    </>
  );
}

/** First stats row: batches, shipments, top locker, and spend — all teal-tinted icons. */
export function VolumeStats({stats}: {stats: DashboardStats}) {
  return (
    <>
      <StatCard
        label={m["dashboard.stat_batches"]()}
        icon={statBatchesUrl}
        iconBg={TEAL_ICON_BG}
        value={stats.totalBatches}
        sub={m["dashboard.stat_batches_sub"]({
          active: stats.activeBatches,
          complete: stats.completeBatches,
          draft: stats.draftBatches,
        })}
      />
      <StatCard
        label={m["dashboard.stat_shipments"]()}
        icon={statShipmentsUrl}
        iconBg={TEAL_ICON_BG}
        value={stats.totalShipments.toLocaleString()}
        sub={m["dashboard.stat_shipments_sub"]()}
      />
      <StatCard
        label={m["dashboard.stat_top_locker"]()}
        icon={statLockerUrl}
        iconBg={TEAL_ICON_BG}
        value={stats.topLocker?.code ?? "0"}
        sub={
          stats.topLocker
            ? m["dashboard.stat_top_locker_sub"]({area: stats.topLocker.area, deliveries: stats.topLocker.deliveries})
            : m["dashboard.stat_top_locker_empty"]()
        }
      />
      <StatCard
        label={m["dashboard.stat_spend"]()}
        icon={statSpendUrl}
        iconBg={TEAL_ICON_BG}
        value={<SpendValue amount={stats.totalSpend} />}
        sub={m["dashboard.stat_spend_sub"]({avg: formatNaira(stats.avgPerShipment)})}
      />
    </>
  );
}
