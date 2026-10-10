import {Checkbox} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import type {AdminRow} from "@/types/admins-types";
import {AdminRolePill, AdminStatusPill} from "./admin-pills";

const HEADERS: {key: string; label: () => string; width: string}[] = [
  {key: "name", label: m["admins.col_name"], width: "w-[200px]"},
  {key: "email", label: m["admins.col_email"], width: "w-[250px]"},
  {key: "role", label: m["admins.col_role"], width: "w-[158px]"},
  {key: "lastActive", label: m["admins.col_last_active"], width: "w-[158px]"},
  {key: "added", label: m["admins.col_added"], width: "w-[158px]"},
  {key: "status", label: m["admins.col_status"], width: ""},
];

const CELL = "h-14 overflow-clip px-4 text-sm leading-[1.4] tracking-[0.14px] text-ellipsis whitespace-nowrap text-grey-600";
const HEAD_CELL = "h-12 px-4 text-left text-sm leading-[1.4] font-medium tracking-[0.14px] whitespace-nowrap text-black";

interface AdminsTableProps {
  rows: AdminRow[];
  selected: ReadonlySet<string>;
  onToggleRow: (id: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
  onOpen: (id: string) => void;
}

/** The admins table — selectable rows plus Name / Email / Role / Last Active / Date Added / Status. Row click opens the drawer. */
export function AdminsTable({rows, selected, onToggleRow, onToggleAll, onOpen}: AdminsTableProps) {
  const allChecked = rows.length > 0 && rows.every((row) => selected.has(row.id));
  return (
    <table className="w-full border border-grey-200" aria-label={m["admins.title"]()}>
      <thead>
        <tr className="bg-grey-100">
          <th className="w-[30px] py-4 pl-4">
            <Checkbox
              checked={allChecked}
              onCheckedChange={(checked) => onToggleAll(checked === true)}
              aria-label={m["admins.select_all"]()}
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
          <AdminTableRow
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

function AdminTableRow({
  row,
  checked,
  onToggle,
  onOpen,
}: {
  row: AdminRow;
  checked: boolean;
  onToggle: (checked: boolean) => void;
  onOpen: () => void;
}) {
  return (
    <tr
      onClick={onOpen}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
      className="cursor-pointer border-t border-grey-200 bg-white transition-colors hover:bg-grey-100/60"
    >
      <td className="py-4 pl-4" onClick={(event) => event.stopPropagation()}>
        <Checkbox checked={checked} onCheckedChange={(value) => onToggle(value === true)} aria-label={row.name} className="size-3.5" />
      </td>
      <td className={`${CELL} font-medium text-black`}>{row.name}</td>
      <td className={CELL}>{row.email}</td>
      <td className="h-14 px-4">
        <AdminRolePill role={row.role} />
      </td>
      <td className={CELL}>{row.lastActive}</td>
      <td className={CELL}>{row.addedAt}</td>
      <td className="h-14 px-4">
        <AdminStatusPill status={row.status} />
      </td>
    </tr>
  );
}
