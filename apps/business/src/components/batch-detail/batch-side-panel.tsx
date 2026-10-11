import {m} from "@/paraglide/messages";
import {formatNaira} from "@/lib/format-naira";
import type {BatchDetail} from "@/types/batch-types";
import {SummaryBlock, SummaryRow} from "@/components/batch/summary-block";

/** Right-hand column of the batch detail: delivery-stage counts and the cost recap. */
export function BatchSidePanel({batch}: {batch: BatchDetail}) {
  const {breakdown, cost} = batch;
  const percent = Math.round(batch.progress * 100);
  return (
    <div className="flex w-[263px] shrink-0 flex-col gap-6">
      <div className="flex w-full flex-col gap-5 rounded-lg border-[0.75px] border-grey-200 bg-white p-4">
        <p className="text-base leading-[1.4] font-medium tracking-[0.16px] text-black">{m["batches.breakdown"]()}</p>
        <SummaryBlock>
          <SummaryRow label={m["batches.collected"]()} value={breakdown.collected === 0 ? "0%" : `${breakdown.collected} · ${percent}%`} />
          <SummaryRow label={m["batches.ready_collection"]()} value={String(breakdown.readyForCollection)} />
          <SummaryRow label={m["batches.stage_in_transit"]()} value={String(breakdown.inTransit)} />
          <SummaryRow label={m["batches.stage_courier_assigned"]()} value={String(breakdown.courierAssigned)} />
          <SummaryRow label={m["batches.stage_awaiting_dropoff"]()} value={String(breakdown.awaitingDropoff)} />
          <SummaryRow label={m["batches.stage_failed"]()} value={String(breakdown.failed)} />
        </SummaryBlock>
      </div>
      <div className="flex w-full flex-col gap-5 rounded-lg border-[0.75px] border-grey-200 bg-white p-4">
        <p className="text-base leading-[1.4] font-medium tracking-[0.16px] text-black">{m["batches.cost_summary"]()}</p>
        <SummaryBlock>
          <SummaryRow label={m["batches.line_standard"]({n: cost.standardCount})} value={`₦${formatNaira(cost.standardCost)}`} />
          <SummaryRow label={m["batches.line_express"]({n: cost.expressCount})} value={`₦${formatNaira(cost.expressCost)}`} />
          <SummaryRow label={m["batches.platform_fee"]()} value={`₦${formatNaira(cost.platformFee)}`} />
          <SummaryRow label={m["batches.total"]()} value={`₦${formatNaira(cost.total)}`} />
        </SummaryBlock>
      </div>
    </div>
  );
}
