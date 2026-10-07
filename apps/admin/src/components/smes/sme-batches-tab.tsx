import {StatusTag} from "@alvo/ui";
import {formatNaira} from "@/lib/format";
import {m} from "@/paraglide/messages";
import type {SmeBatch, SmeDetail} from "@/types/smes-types";
import activityEmptyIcon from "@/assets/activity-empty-icon.svg";
import {batchDayLabel, batchStamp} from "./sme-labels";

const BATCH_STATUS_TAG = {active: "pickup", completed: "success"} as const;
const BATCH_STATUS_LABELS = {active: m["smes.batch_status_active"], completed: m["smes.batch_status_completed"]} as const;

function BatchRow({batch}: {batch: SmeBatch}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm leading-[1.4] font-bold tracking-[0.14px] text-black">{batch.id}</p>
        <p className="pt-0.5 text-[13px] leading-[1.4] tracking-[0.13px] text-grey-500">
          {m["smes.batch_meta"]({parcels: batch.parcels, amount: formatNaira(batch.amountKobo), stamp: batchStamp(batch.createdAt)})}
        </p>
      </div>
      <StatusTag status={BATCH_STATUS_TAG[batch.status]}>{BATCH_STATUS_LABELS[batch.status]()}</StatusTag>
    </div>
  );
}

/** Groups a flat batch list by calendar day, keeping the backend's ordering inside each group. */
function groupByDay(batches: SmeBatch[]): {label: string; items: SmeBatch[]}[] {
  const groups: {label: string; items: SmeBatch[]}[] = [];
  for (const batch of batches) {
    const day = batch.createdAt.slice(0, 10);
    const last = groups[groups.length - 1];
    if (last && last.label === day) {
      last.items.push(batch);
    } else {
      groups.push({label: day, items: [batch]});
    }
  }
  return groups;
}

/** Batch History tab — date-grouped batches, or the centered empty state. */
export function SmeBatchesTab({detail}: {detail: SmeDetail}) {
  if (detail.batches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <img src={activityEmptyIcon} alt="" className="size-14" aria-hidden="true" />
        <p className="text-base font-bold text-black">{m["smes.batches_empty_title"]()}</p>
        <p className="max-w-[320px] text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{m["smes.batches_empty_description"]()}</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      {groupByDay(detail.batches).map((group) => (
        <div key={group.label}>
          <div className="flex items-center gap-3 py-3">
            <span className="h-px flex-1 bg-grey-200" />
            <span className="text-xs tracking-[0.12px] text-grey-500">{batchDayLabel(group.items[0].createdAt)}</span>
            <span className="h-px flex-1 bg-grey-200" />
          </div>
          <div className="divide-y divide-grey-200">
            {group.items.map((batch) => (
              <BatchRow key={batch.id} batch={batch} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
