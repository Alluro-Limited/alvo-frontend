import {m} from "@/paraglide/messages";
import {formatNairaAmount} from "@/lib/format";
import type {BatchDetail} from "@/types/workloads-types";
import {BatchProgress} from "./batch-progress";
import {BatchTagPill} from "./batch-tag-pill";
import {formatTimelineAt} from "./workloads-format";

/** Batch header card: id + tag pills, SME/time/city, total value, and the delivery progress bar. */
export function BatchDetailHeader({batch}: {batch: BatchDetail}) {
  return (
    <article className="flex flex-col gap-4 rounded-lg bg-white p-4">
      <div className="flex items-center gap-2">
        <h2 className="text-lg leading-[1.4] font-semibold tracking-[0.18px] text-primary-800">{batch.id}</h2>
        {batch.tags.map((tag) => (
          <BatchTagPill key={tag} tag={tag} />
        ))}
      </div>
      <p className="text-sm leading-[1.4] tracking-[0.14px] text-grey-600">
        {batch.sme} · {m["workloads.batch_created"]({at: formatTimelineAt(batch.createdAt)})} · {batch.city}
      </p>
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{m["workloads.batch_total_value"]()}</p>
          <p className="text-lg leading-[1.4] font-bold tracking-[0.18px] text-primary-800">{formatNairaAmount(batch.totalValue)}</p>
        </div>
        <BatchProgress delivered={batch.delivered} total={batch.parcelCount} width="w-[360px]" />
      </div>
    </article>
  );
}
