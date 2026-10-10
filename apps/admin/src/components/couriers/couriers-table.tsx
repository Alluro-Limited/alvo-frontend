import {Checkbox} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import type {CourierRow} from "@/types/couriers-types";
import {CourierAvatar} from "./courier-avatar";
import {CourierStatusPill} from "./courier-status-pill";
import {CourierVehicleCell} from "./courier-vehicle-cell";
import {CourierVerificationPill} from "./courier-verification-pill";

const HEADERS: {key: string; label: () => string; width: string}[] = [
  {key: "id", label: m["couriers.col_id"], width: "w-[190px]"},
  {key: "name", label: m["couriers.col_name"], width: "w-[180px]"},
  {key: "vehicle", label: m["couriers.col_vehicle"], width: "w-[150px]"},
  {key: "zone", label: m["couriers.col_zone"], width: "w-[160px]"},
  {key: "verification", label: m["couriers.col_verification"], width: "w-[130px]"},
  {key: "rate", label: m["couriers.col_success_rate"], width: "w-[120px]"},
  {key: "status", label: m["couriers.col_status"], width: "w-[120px]"},
];

const CELL = "h-14 overflow-clip px-4 text-sm leading-[1.4] tracking-[0.14px] text-ellipsis whitespace-nowrap text-grey-600";
const HEAD_CELL = "h-12 px-4 text-left text-sm leading-[1.4] font-medium tracking-[0.14px] whitespace-nowrap text-black";

interface CouriersTableProps {
  rows: CourierRow[];
  selected: ReadonlySet<string>;
  onToggleRow: (id: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
  onOpen: (id: string) => void;
}

/** The couriers table — selectable rows; clicking a row opens the courier drawer. */
export function CouriersTable({rows, selected, onToggleRow, onToggleAll, onOpen}: CouriersTableProps) {
  const allChecked = rows.length > 0 && rows.every((row) => selected.has(row.id));
  return (
    <table className="w-full border border-grey-200" aria-label={m["couriers.title"]()}>
      <thead>
        <tr className="bg-grey-100">
          <th className="w-[30px] py-4 pl-4">
            <Checkbox
              checked={allChecked}
              onCheckedChange={(checked) => onToggleAll(checked === true)}
              aria-label={m["couriers.col_status"]()}
              className="size-3.5"
            />
          </th>
          {HEADERS.map((header) => (
            <th key={header.key} className={`${HEAD_CELL} ${header.width}`}>
              {header.label()}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <CouriersTableRow
            key={row.id}
            row={row}
            checked={selected.has(row.id)}
            onToggle={(checked) => onToggleRow(row.id, checked)}
            onOpen={() => onOpen(row.id)}
          />
        ))}
      </tbody>
    </table>
  );
}

function CouriersTableRow({
  row,
  checked,
  onToggle,
  onOpen,
}: {
  row: CourierRow;
  checked: boolean;
  onToggle: (checked: boolean) => void;
  onOpen: () => void;
}) {
  const pending = row.verification === "pending";
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
      <IdCell row={row} />
      <td className={CELL}>{row.name}</td>
      <td className={CELL}>
        <CourierVehicleCell vehicle={row.vehicle} />
      </td>
      <td className={CELL}>{row.zone}</td>
      <td className="h-14 px-4">
        <CourierVerificationPill verification={row.verification} />
      </td>
      <td className={`${CELL} ${pending ? "text-grey-400" : "text-status-warning-dark"}`}>
        {row.successRate === null ? "-" : `${row.successRate}%`}
      </td>
      <td className="h-14 px-4">
        {pending ? <span className="text-sm text-grey-400">-</span> : <CourierStatusPill status={row.status} />}
      </td>
    </tr>
  );
}

/** Rank chip + avatar + courier ID — the first column cell. */
function IdCell({row}: {row: CourierRow}) {
  return (
    <td className={`${CELL} font-medium text-black`}>
      <span className="flex items-center gap-2">
        <span className="w-6 shrink-0 text-primary-500">{`#${row.rank}`}</span>
        <CourierAvatar id={row.id} name={row.name} photoUrl={row.photoUrl} />
        {row.id}
      </span>
    </td>
  );
}
