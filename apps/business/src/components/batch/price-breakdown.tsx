import {m} from "@/paraglide/messages";
import {formatNaira} from "@/lib/format-naira";
import type {BulkCost} from "@/lib/shipment-pricing";

const rowClass = "flex w-full items-center justify-between py-3";

function Line({label, value, bold}: {label: string; value: string; bold?: boolean}) {
  return (
    <div className={rowClass}>
      <p className={`text-sm leading-[1.4] tracking-[0.14px] ${bold ? "font-medium text-black" : "text-grey-600"}`}>{label}</p>
      <p className={`text-sm leading-[1.4] tracking-[0.14px] ${bold ? "font-bold text-black" : "font-medium text-grey-700"}`}>₦{value}</p>
    </div>
  );
}

/** Step-4 left card: per-priority line items, platform fee, and the grand total. */
export function PriceBreakdown({cost}: {cost: BulkCost}) {
  const shipments = cost.standardCount + cost.expressCount;
  return (
    <div className="flex w-full flex-col">
      <p className="pb-1 text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{m["wiz.breakdown"]()}</p>
      <div className="flex w-full flex-col divide-y divide-grey-300 rounded-lg border border-grey-300 px-4">
        <Line label={m["wiz.line_standard"]({n: cost.standardCount})} value={formatNaira(cost.standardCost)} />
        {cost.expressCount > 0 && <Line label={m["wiz.line_express"]({n: cost.expressCount})} value={formatNaira(cost.expressCost)} />}
        <Line label={m["wiz.subtotal"]({n: shipments})} value={formatNaira(cost.subtotal)} />
        <Line label={m["wiz.fee"]()} value={formatNaira(cost.platformFee)} />
        <Line label={m["wiz.total"]()} value={formatNaira(cost.total)} bold />
      </div>
    </div>
  );
}
