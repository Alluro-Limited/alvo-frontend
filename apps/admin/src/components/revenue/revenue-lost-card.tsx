import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import {formatCompactNaira, formatCount, formatPct} from "@/lib/format-revenue";
import type {RevenueLostBreakdown, RevenueLostItem} from "@/types/revenue-types";

interface TileSpec {
  key: "failedDeliveries" | "refunds" | "billingErrors" | "disputes";
  title: string;
  count: (item: RevenueLostItem) => string;
  bg: string;
  fg: string;
  border: boolean;
}

/** Figma tile tints: fail red, warning amber, accent purple, plain grey for disputes. */
const TILES: TileSpec[] = [
  {
    key: "failedDeliveries",
    title: m["revenue.lost_failed"](),
    count: (item) => m["revenue.lost_incidents"]({count: formatCount(item.count)}),
    bg: "bg-status-fail-subtle",
    fg: "text-status-fail-dark",
    border: false,
  },
  {
    key: "refunds",
    title: m["revenue.lost_refunds"](),
    count: (item) => m["revenue.lost_refunds_count"]({count: formatCount(item.count)}),
    bg: "bg-status-warning-subtle",
    fg: "text-status-warning-dark",
    border: false,
  },
  {
    key: "billingErrors",
    title: m["revenue.lost_billing"](),
    count: (item) => m["revenue.lost_corrected"]({count: formatCount(item.count)}),
    bg: "bg-accent-50",
    fg: "text-accent-500",
    border: false,
  },
  {
    key: "disputes",
    title: m["revenue.lost_disputes"](),
    count: (item) => m["revenue.lost_closed"]({count: formatCount(item.count)}),
    bg: "bg-grey-50",
    fg: "text-grey-700",
    border: true,
  },
];

/** The "Revenue Lost — Breakdown" card: totals header over four cause tiles. */
export function RevenueLostCard({lost}: {lost: RevenueLostBreakdown}) {
  return (
    <section data-testid="revenue-lost-card" className="flex flex-col gap-4 rounded-xl border border-grey-300 bg-white p-3">
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-primary-800">{m["revenue.lost_title"]()}</h2>
          <p className="text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{m["revenue.lost_subtitle"]()}</p>
        </div>
        <div className="flex flex-col items-end">
          <p className="flex items-baseline gap-px text-status-fail-dark">
            <span className="text-lg leading-[1.4] tracking-[0.18px]">₦</span>
            <span className="text-2xl leading-[1.2] font-bold tracking-[-0.24px]" data-testid="lost-total">
              {formatCompactNaira(lost.total)}
            </span>
          </p>
          <p className="text-sm leading-[1.4] tracking-[0.14px] text-status-fail-dark">
            {m["revenue.lost_pct"]({pct: formatPct(lost.pctOfGross)})}
          </p>
        </div>
      </header>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {TILES.map((tile) => {
          const item = lost[tile.key];
          return (
            <div
              key={tile.key}
              data-testid={`lost-tile-${tile.key}`}
              className={cn("flex flex-col gap-1.5 rounded-lg p-3", tile.bg, tile.border && "border border-grey-300")}
            >
              <p className={cn("text-sm leading-[1.4] font-medium tracking-[0.14px]", tile.fg)}>{tile.title}</p>
              <p className={cn("flex items-baseline gap-px", tile.fg)}>
                <span className="text-sm">₦</span>
                <span className="text-xl leading-[1.2] font-bold">{formatCompactNaira(item.amount)}</span>
              </p>
              <p className={cn("text-xs leading-[1.4] tracking-[0.12px]", tile.fg)}>{tile.count(item)}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
