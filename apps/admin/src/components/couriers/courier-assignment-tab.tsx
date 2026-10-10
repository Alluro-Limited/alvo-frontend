import {ChevronRight, List} from "lucide-react";
import {m} from "@/paraglide/messages";
import type {CourierDetail} from "@/types/couriers-types";
import {InfoRow} from "@/components/workloads/info-row";

interface CourierAssignmentTabProps {
  detail: CourierDetail;
  onOpenHistory: (detail: CourierDetail) => void;
}

function PerfCell({value, label}: {value: string; label: string}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg border border-grey-200 py-4">
      <span className="text-2xl leading-[1.3] font-medium text-primary-600">{value}</span>
      <span className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{label}</span>
    </div>
  );
}

/** Assignment History tab: the 2×2 performance grid, deliveries stats, and the history banner. */
export function CourierAssignmentTab({detail, onOpenHistory}: CourierAssignmentTabProps) {
  const perf = detail.performance;
  return (
    <div className="flex flex-col gap-3">
      <section className="rounded-lg bg-white p-4" aria-label={m["couriers.perf_title"]()}>
        <h3 className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{m["couriers.perf_title"]()}</h3>
        <div className="grid grid-cols-2 gap-2 pt-3">
          <PerfCell value={`#${perf.rank}`} label={m["couriers.perf_rank"]()} />
          <PerfCell value={`${perf.successRate}%`} label={m["couriers.perf_success_rate"]()} />
          <PerfCell value={`${perf.slaRate}%`} label={m["couriers.perf_sla_rate"]()} />
          <PerfCell value={m["couriers.perf_avg_time_value"]({minutes: perf.avgTimeMinutes})} label={m["couriers.perf_avg_time"]()} />
        </div>
      </section>
      <section className="rounded-lg bg-white p-4">
        <InfoRow label={m["couriers.stat_total_deliveries"]()}>{perf.totalDeliveries}</InfoRow>
        <InfoRow label={m["couriers.stat_out_of_zone"]()}>{perf.outOfZone}</InfoRow>
      </section>
      <button
        type="button"
        onClick={() => onOpenHistory(detail)}
        className="flex w-full items-center gap-3 rounded-lg bg-primary-50 p-3 text-left text-primary-500 transition-colors hover:bg-primary-100"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/60">
          <List className="size-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base leading-[1.4] font-medium tracking-[0.14px]">
            {m["couriers.view_history"]({count: perf.totalDeliveries})}
          </span>
          <span className="block text-xs leading-[1.4] tracking-[0.12px]">
            {perf.totalDeliveries === 1
              ? m["couriers.view_history_sub"]({count: perf.totalDeliveries})
              : m["couriers.view_history_sub_many"]({count: perf.totalDeliveries})}
          </span>
        </span>
        <ChevronRight className="size-4 shrink-0" aria-hidden="true" />
      </button>
    </div>
  );
}
