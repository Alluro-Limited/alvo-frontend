import {useNavigate} from "@tanstack/react-router";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import {useDeleteBatchMutation} from "@/queries/use-batch-queries";
import {formatNaira} from "@/lib/format-naira";
import type {BatchSummary} from "@/types/batch-types";
import {BatchRowMenu} from "./batch-row-menu";
import {BatchStatusChip} from "./batch-status-chip";

const COLUMNS: (() => string)[] = [
  m["batches.col_id"],
  m["batches.col_name"],
  m["batches.col_shipments"],
  m["batches.col_status"],
  m["batches.col_created"],
  m["batches.col_cost"],
  m["batches.col_action"],
];

const cell = "border-t-[0.75px] border-grey-300 px-4 align-middle";
const cellText = "text-sm leading-[1.4] tracking-[0.14px] whitespace-nowrap text-grey-600";

function RowAction({batch}: {batch: BatchSummary}) {
  const deleteBatch = useDeleteBatchMutation();
  if (batch.status === "draft") {
    return (
      <button
        type="button"
        data-row-action
        onClick={() => deleteBatch.mutate(batch.id)}
        className="text-sm leading-[1.4] font-medium tracking-[0.28px] text-status-fail underline"
      >
        {m["batches.delete"]()}
      </button>
    );
  }
  return (
    <div data-row-action>
      <BatchRowMenu batch={batch} />
    </div>
  );
}

function BatchRow({batch}: {batch: BatchSummary}) {
  const navigate = useNavigate();
  const open = (target: EventTarget) => {
    if ((target as HTMLElement).closest("[data-row-action]")) return;
    void navigate({to: "/shipments/$batchId", params: {batchId: batch.id}});
  };
  return (
    <tr
      className="h-[52px] cursor-pointer bg-white"
      tabIndex={0}
      onClick={(event) => open(event.target)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open(event.target);
        }
      }}
    >
      <td className={cell}>
        <span className={cellText}>{batch.id}</span>
      </td>
      <td className={cell}>
        <span className={cn(cellText, "font-medium text-black")}>{batch.name}</span>
      </td>
      <td className={cell}>
        <span className={cellText}>{batch.shipmentCount ?? "—"}</span>
      </td>
      <td className={cell}>
        <BatchStatusChip status={batch.status} />
      </td>
      <td className={cell}>
        <span className={cellText}>{batch.createdAt}</span>
      </td>
      <td className={cell}>
        <span className={cn(cellText, "font-medium text-black")}>
          {batch.totalCost === null ? "—" : `₦${formatNaira(batch.totalCost)}`}
        </span>
      </td>
      <td className={cell}>
        <RowAction batch={batch} />
      </td>
    </tr>
  );
}

/** The batches table: 7 columns, 52px rows inside a rounded bordered card. */
export function BatchesTable({batches}: {batches: BatchSummary[]}) {
  return (
    <div className="w-full overflow-clip rounded-3xl border border-grey-200">
      <table className="w-full border-collapse">
        <thead>
          <tr className="h-[52px] bg-[#f9f9f9]">
            {COLUMNS.map((label) => (
              <th key={label()} scope="col" className="border-b-[0.5px] border-grey-300 px-4 text-left align-middle">
                <span className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{label()}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {batches.map((batch) => (
            <BatchRow key={batch.id} batch={batch} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
