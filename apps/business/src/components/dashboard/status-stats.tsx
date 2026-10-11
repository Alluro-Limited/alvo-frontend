import {m} from "@/paraglide/messages";
import type {DashboardStats} from "@/types/dashboard-types";
import statActiveUrl from "@/assets/stat-active.svg";
import statDeliveredUrl from "@/assets/stat-delivered.svg";
import statFailedUrl from "@/assets/stat-failed.svg";
import statPendingUrl from "@/assets/stat-pending.svg";
import {StatCard} from "./stat-card";

/** Second stats row: active, delivered, pending, and failed counts. */
export function StatusStats({stats}: {stats: DashboardStats}) {
  return (
    <>
      <StatCard
        label={m["dashboard.stat_active"]()}
        icon={statActiveUrl}
        iconBg="bg-secondary-50"
        value={stats.activeShipments}
        sub={m["dashboard.stat_active_sub"]({count: stats.activeShipmentBatches})}
      />
      <StatCard
        label={m["dashboard.stat_delivered"]()}
        icon={statDeliveredUrl}
        iconBg="bg-success-50"
        value={stats.deliveredLast30Days.toLocaleString()}
        sub={m["dashboard.stat_delivered_sub"]()}
      />
      <StatCard
        label={m["dashboard.stat_pending"]()}
        icon={statPendingUrl}
        iconBg="bg-status-warning-subtle"
        value={stats.pending}
        sub={m["dashboard.stat_pending_sub"]()}
      />
      <StatCard
        label={m["dashboard.stat_failed"]()}
        icon={statFailedUrl}
        iconBg="bg-danger-50"
        value={stats.failed}
        sub={m["dashboard.stat_failed_sub"]()}
      />
    </>
  );
}
