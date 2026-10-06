import {Link} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import {formatNairaAmount} from "@/lib/format";
import type {BatchBreakdownKey, BatchRow} from "@/types/workloads-types";
import wlChevron from "@/assets/wl-chevron.svg";
import {BatchProgress} from "./batch-progress";
import {BatchTagPill} from "./batch-tag-pill";
import {formatTimelineAt} from "./workloads-format";

const CHIP_LABELS: Record<BatchBreakdownKey, (count: number) => string> = {
  delivered: (count) => m["workloads.batch_chip_delivered"]({count}),
  in_transit: (count) => m["workloads.batch_chip_in_transit"]({count}),
  delayed: (count) => m["workloads.batch_chip_delayed"]({count}),
};

const CHIP_TONES: Record<BatchBreakdownKey, string> = {
  delivered: "bg-status-success-subtle text-success-700",
  in_transit: "bg-secondary-50 text-secondary-600",
  delayed: "bg-status-warning-subtle text-warning-600",
};

/** One batch in the Batches list: id + tags, SME/time/city, value, progress, breakdown, detail link. */
export function BatchCard({batch}: {batch: BatchRow}) {
  return (
    <article className="flex flex-col gap-4 rounded-lg bg-white p-4">
      <div className="flex items-center gap-2">
        <Link
          to="/workloads/batches/$batchId"
          params={{batchId: batch.id}}
          className="text-sm leading-[1.4] font-semibold tracking-[0.14px] text-primary-800 hover:text-primary-500"
        >
          {batch.id}
        </Link>
        {batch.tags.map((tag) => (
          <BatchTagPill key={tag} tag={tag} />
        ))}
        <Link
          to="/workloads/batches/$batchId"
          params={{batchId: batch.id}}
          className="ml-auto flex items-center gap-1 text-sm leading-[1.4] font-medium tracking-[0.14px] text-primary-500 hover:text-primary-600"
        >
          {m["workloads.batch_view_parcels"]()}
          <img src={wlChevron} alt="" className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
      <p className="text-sm leading-[1.4] tracking-[0.14px] text-grey-600">
        {batch.sme} · {m["workloads.batch_created"]({at: formatTimelineAt(batch.createdAt)})} · {batch.city}
      </p>
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{m["workloads.batch_total_value"]()}</p>
          <p className="text-lg leading-[1.4] font-bold tracking-[0.18px] text-primary-800">{formatNairaAmount(batch.totalValue)}</p>
        </div>
        <BatchProgress delivered={batch.delivered} total={batch.parcelCount} width="w-[280px]" />
      </div>
      {batch.breakdown.length > 0 && (
        <div className="flex gap-2">
          {batch.breakdown.map((chip) => (
            <span
              key={chip.key}
              className={`rounded-full px-2.5 py-1 text-xs leading-[1.4] font-medium tracking-[0.12px] ${CHIP_TONES[chip.key]}`}
            >
              {CHIP_LABELS[chip.key](chip.count)}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
