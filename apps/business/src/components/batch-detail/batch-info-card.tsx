import {ArrowDownToLine} from "lucide-react";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import {downloadTextFile} from "@/lib/download-text-file";
import {formatNaira} from "@/lib/format-naira";
import type {BatchDetail} from "@/types/batch-types";

function InfoField({label, value, valueClass}: {label: string; value: string; valueClass?: string}) {
  return (
    <div className="flex flex-1 flex-col gap-1">
      <p className="text-sm leading-[1.4] tracking-[0.14px] text-grey-600">{label}</p>
      <p className={cn("text-base leading-[1.4] font-medium tracking-[0.16px] text-black", valueClass)}>{value}</p>
    </div>
  );
}

function ProgressBar({progress}: {progress: number}) {
  const percent = Math.round(progress * 100);
  return (
    <div className="flex flex-1 flex-col gap-3">
      <p className="text-sm leading-[1.4] tracking-[0.14px] text-grey-600">{m["batches.progress"]()}</p>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={m["batches.progress"]()}
        className="h-1.5 w-full max-w-[400px] overflow-clip rounded-xl bg-[#ececec]"
      >
        <div className="h-1.5 rounded-l-xl bg-primary-500" style={{width: `${percent}%`}} />
      </div>
    </div>
  );
}

/** The top card of the batch detail: id/created + label download + the 4×2 info grid. */
export function BatchInfoCard({batch}: {batch: BatchDetail}) {
  return (
    <section className="flex w-full flex-col gap-6 rounded-lg border-[0.75px] border-grey-200 bg-white p-4">
      <div className="flex w-full items-center gap-2.5">
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-base leading-[1.4] font-medium tracking-[0.16px] text-black">{batch.id}</p>
          <p className="text-sm leading-[1.4] tracking-[0.14px] text-grey-600">{batch.createdAt}</p>
        </div>
        <button
          type="button"
          onClick={() => downloadTextFile(`${batch.id}-labels.txt`, `${batch.name} (${batch.id}) — shipment labels\n`)}
          className="flex h-[38px] items-center gap-2 rounded-lg px-3 py-2 text-base leading-[1.4] font-medium tracking-[0.32px] text-primary-500"
        >
          <ArrowDownToLine className="size-[22px]" aria-hidden="true" />
          {m["batches.download_labels"]()}
        </button>
      </div>
      <div className="flex w-full flex-col gap-6">
        <div className="flex gap-2.5">
          <InfoField label={m["batches.total_shipments"]()} value={String(batch.totalShipments)} />
          <InfoField label={m["batches.delivered"]()} value={String(batch.delivered)} valueClass="text-success-600" />
        </div>
        <div className="flex gap-2.5">
          <InfoField label={m["batches.in_progress"]()} value={String(batch.inProgress)} valueClass="text-status-warning-dark" />
          <InfoField label={m["batches.failed"]()} value={String(batch.failed)} valueClass="text-status-fail-dark" />
        </div>
        <div className="flex gap-2.5">
          <InfoField label={m["batches.origin_locker"]()} value={batch.originLocker} />
          <InfoField label={m["batches.total_cost"]()} value={`₦${formatNaira(batch.totalCost)}`} />
        </div>
        <div className="flex gap-2.5">
          <InfoField label={m["batches.delivery_priority"]()} value={batch.priorities} />
          <ProgressBar progress={batch.progress} />
        </div>
      </div>
    </section>
  );
}
