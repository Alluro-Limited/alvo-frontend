import {Checkbox} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import type {ParcelRow} from "@/types/workloads-types";
import {ParcelStatusTag} from "./parcel-status-tag";
import {formatSla} from "./workloads-format";

export type WorkloadsTableVariant = "single" | "batch";

const HEADERS: Record<WorkloadsTableVariant, {key: string; label: () => string; width: string}[]> = {
  single: [
    {key: "parcel", label: m["workloads.col_parcel_id"], width: "w-[110px]"},
    {key: "sender", label: m["workloads.col_sender"], width: "w-[150px]"},
    {key: "destination", label: m["workloads.col_destination"], width: "w-[165px]"},
    {key: "courier", label: m["workloads.col_courier"], width: ""},
    {key: "node", label: m["workloads.col_destination_node"], width: "w-[160px]"},
    {key: "status", label: m["workloads.col_status"], width: "w-[160px]"},
    {key: "sla", label: m["workloads.col_sla"], width: ""},
  ],
  batch: [
    {key: "parcel", label: m["workloads.col_parcel_id"], width: "w-[110px]"},
    {key: "recipient", label: m["workloads.col_recipient"], width: "w-[150px]"},
    {key: "destination", label: m["workloads.col_destination"], width: "w-[165px]"},
    {key: "courier", label: m["workloads.col_courier"], width: ""},
    {key: "node", label: m["workloads.col_last_node"], width: "w-[160px]"},
    {key: "status", label: m["workloads.col_status"], width: "w-[160px]"},
    {key: "sla", label: m["workloads.col_sla_left"], width: ""},
  ],
};

const CELL = "h-12 overflow-clip px-4 text-sm leading-[1.4] tracking-[0.14px] text-ellipsis whitespace-nowrap text-grey-600";
const HEAD_CELL = "h-12 px-4 text-left text-sm leading-[1.4] font-medium tracking-[0.14px] whitespace-nowrap text-black";

interface WorkloadsTableProps {
  rows: ParcelRow[];
  variant: WorkloadsTableVariant;
  selected: ReadonlySet<string>;
  onToggleRow: (id: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
  onOpen: (id: string) => void;
}

/** The parcels table: selectable rows with status pills; clicking a row opens the detail drawer. */
export function WorkloadsTable({rows, variant, selected, onToggleRow, onToggleAll, onOpen}: WorkloadsTableProps) {
  const allChecked = rows.length > 0 && rows.every((row) => selected.has(row.id));
  return (
    <table className="w-full border border-grey-200" aria-label={m["nav.workloads"]()}>
      <thead>
        <tr className="bg-grey-100">
          <th className="w-[30px] py-4 pl-4">
            <Checkbox
              checked={allChecked}
              onCheckedChange={(checked) => onToggleAll(checked === true)}
              aria-label={m["workloads.col_status"]()}
              className="size-3.5"
            />
          </th>
          {HEADERS[variant].map((header) => (
            <th key={header.key} className={`${HEAD_CELL} ${header.width}`}>
              {header.label()}
            </th>
          ))}
          <th className="w-12" aria-hidden="true" />
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <ParcelTableRow
            key={row.id}
            row={row}
            variant={variant}
            checked={selected.has(row.id)}
            onToggle={(checked) => onToggleRow(row.id, checked)}
            onOpen={() => onOpen(row.id)}
          />
        ))}
      </tbody>
    </table>
  );
}

function ParcelTableRow({
  row,
  variant,
  checked,
  onToggle,
  onOpen,
}: {
  row: ParcelRow;
  variant: WorkloadsTableVariant;
  checked: boolean;
  onToggle: (checked: boolean) => void;
  onOpen: () => void;
}) {
  return (
    <tr
      onClick={onOpen}
      tabIndex={0}
      onKeyDown={(event) => {
        // Only the focused row activates — events from the checkbox bubble up here too.
        if (event.target !== event.currentTarget) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
      className="cursor-pointer border-t border-grey-200 bg-white transition-colors hover:bg-grey-100/60"
    >
      <td className="py-4 pl-4" onClick={(event) => event.stopPropagation()}>
        <Checkbox checked={checked} onCheckedChange={(value) => onToggle(value === true)} aria-label={row.id} className="size-3.5" />
      </td>
      <td className={CELL}>{row.id}</td>
      <td className={CELL}>{variant === "batch" ? (row.recipient ?? row.sender) : row.sender}</td>
      <td className={CELL}>{row.destination}</td>
      <td className={CELL}>{row.courierId ?? "—"}</td>
      <td className={CELL}>{variant === "batch" ? (row.lastNodeId ?? row.destinationNodeId) : row.destinationNodeId}</td>
      <td className="h-12 px-4">
        <ParcelStatusTag status={row.status} />
      </td>
      <td className={CELL}>{formatSla(row.slaRemainingMin)}</td>
      <td className="w-12" aria-hidden="true" />
    </tr>
  );
}
