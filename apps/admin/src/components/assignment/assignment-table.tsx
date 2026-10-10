import {Checkbox} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import type {AssignmentRow} from "@/types/assignment-types";
import {AssignmentStatusPill} from "./assignment-status-pill";
import {AssignmentTypePill} from "./assignment-type-pill";

const HEADERS: {key: string; label: () => string; width: string}[] = [
  {key: "id", label: m["assignment.col_id"], width: "w-[150px]"},
  {key: "type", label: m["assignment.col_type"], width: "w-[110px]"},
  {key: "courier", label: m["assignment.col_courier"], width: "w-[190px]"},
  {key: "pickup", label: m["assignment.col_pickup"], width: "w-[190px]"},
  {key: "dropoff", label: m["assignment.col_dropoff"], width: "w-[190px]"},
  {key: "items", label: m["assignment.col_items"], width: "w-[90px]"},
  {key: "status", label: m["assignment.col_status"], width: "w-[140px]"},
];

const CELL = "h-14 overflow-clip px-4 text-sm leading-[1.4] tracking-[0.14px] text-ellipsis whitespace-nowrap text-grey-600";
const HEAD_CELL = "h-12 px-4 text-left text-sm leading-[1.4] font-medium tracking-[0.14px] whitespace-nowrap text-black";

interface AssignmentTableProps {
  rows: AssignmentRow[];
  selected: ReadonlySet<string>;
  onToggleRow: (id: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
  onOpen: (id: string) => void;
}

/** The assignments table — selectable rows; clicking a row opens the assignment drawer. */
export function AssignmentTable({rows, selected, onToggleRow, onToggleAll, onOpen}: AssignmentTableProps) {
  const allChecked = rows.length > 0 && rows.every((row) => selected.has(row.id));
  return (
    <table className="w-full border border-grey-200" aria-label={m["nav.assignment"]()}>
      <thead>
        <tr className="bg-grey-100">
          <th className="w-[30px] py-4 pl-4">
            <Checkbox
              checked={allChecked}
              onCheckedChange={(checked) => onToggleAll(checked === true)}
              aria-label={m["assignment.col_status"]()}
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
          <AssignmentTableRow
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

function AssignmentTableRow({
  row,
  checked,
  onToggle,
  onOpen,
}: {
  row: AssignmentRow;
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
      <td className={`${CELL} font-medium text-black`}>{row.id}</td>
      <td className={CELL}>
        <AssignmentTypePill type={row.type} />
      </td>
      <td className={CELL}>{row.courier?.name ?? "-"}</td>
      <td className={CELL}>{row.pickup}</td>
      <td className={CELL}>{row.dropoff}</td>
      <td className={CELL}>
        {row.items === 1 ? m["assignment.items_count_one"]({count: row.items}) : m["assignment.items_count"]({count: row.items})}
      </td>
      <td className="h-14 px-4">
        <AssignmentStatusPill status={row.status} />
      </td>
    </tr>
  );
}
