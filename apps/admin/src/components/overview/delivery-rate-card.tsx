import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {DeliveryRateSummary} from "@/types/dashboard-types";
import {PanelHeader} from "./panel-header";

const ROWS = [
  {key: "onTime", label: m["overview.delivery_on_time"], text: "text-status-success-dark", fill: "bg-status-success"},
  {key: "late", label: m["overview.delivery_late"], text: "text-status-warning-dark", fill: "bg-status-warning"},
  {key: "failed", label: m["overview.delivery_failed"], text: "text-status-fail-dark", fill: "bg-status-fail"},
] as const;

/** Delivery-rate breakdown: header badge plus one labeled progress bar per outcome. */
export function DeliveryRateCard({rate}: {rate: DeliveryRateSummary}) {
  return (
    <section className="flex flex-col overflow-clip rounded-xl bg-white pb-3" aria-label={m["overview.delivery_title"]()}>
      <PanelHeader title={m["overview.delivery_title"]()}>
        <span className="rounded-md bg-[#f2fff7] px-1 py-0.5 text-xs leading-[1.4] font-medium tracking-[0.24px] text-status-success-dark">
          {m["overview.delivery_today"]({percent: rate.today})}
        </span>
      </PanelHeader>
      <div className="flex flex-col gap-2 px-3 pt-3">
        {ROWS.map((row) => (
          <div key={row.key} className="flex w-full flex-col gap-1 py-1">
            <div className="flex w-full items-center justify-between text-xs leading-[1.4] font-medium tracking-[0.12px]">
              <span className="text-grey-600">{row.label()}</span>
              <span className={row.text}>{rate[row.key]}%</span>
            </div>
            <div className="h-1.5 w-full overflow-clip rounded-full bg-[#ececec]">
              <div className={cn("h-full rounded-full transition-[width] duration-500", row.fill)} style={{width: `${rate[row.key]}%`}} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
