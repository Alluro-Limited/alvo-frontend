import {Checkbox} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import type {UserRow} from "@/types/users-types";
import {UserStatusPill} from "./user-status-pill";
import {VerificationPill} from "./verification-pill";
import {formatJoined} from "./user-labels";

const HEADERS: {key: string; label: () => string; width: string}[] = [
  {key: "id", label: m["users.col_id"], width: "w-[150px]"},
  {key: "sender", label: m["users.col_sender"], width: "w-[200px]"},
  {key: "email", label: m["users.col_email"], width: "w-[240px]"},
  {key: "verification", label: m["users.col_verification"], width: "w-[130px]"},
  {key: "joined", label: m["users.col_joined"], width: "w-[120px]"},
  {key: "status", label: m["users.col_status"], width: "w-[130px]"},
];

const CELL = "h-14 overflow-clip px-4 text-sm leading-[1.4] tracking-[0.14px] text-ellipsis whitespace-nowrap text-grey-600";
const HEAD_CELL = "h-12 px-4 text-left text-sm leading-[1.4] font-medium tracking-[0.14px] whitespace-nowrap text-black";

interface UsersTableProps {
  rows: UserRow[];
  selected: ReadonlySet<string>;
  onToggleRow: (id: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
  onOpen: (id: string) => void;
}

/** The users table — selectable rows; clicking a row opens the user drawer. */
export function UsersTable({rows, selected, onToggleRow, onToggleAll, onOpen}: UsersTableProps) {
  const allChecked = rows.length > 0 && rows.every((row) => selected.has(row.id));
  return (
    <table className="w-full border border-grey-200" aria-label={m["users.title"]()}>
      <thead>
        <tr className="bg-grey-100">
          <th className="w-[30px] py-4 pl-4">
            <Checkbox
              checked={allChecked}
              onCheckedChange={(checked) => onToggleAll(checked === true)}
              aria-label={m["users.col_status"]()}
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
          <UsersTableRow
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

function UsersTableRow({
  row,
  checked,
  onToggle,
  onOpen,
}: {
  row: UserRow;
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
      <td className={CELL}>{row.name}</td>
      <td className={CELL}>{row.email}</td>
      <td className="h-14 px-4">
        <VerificationPill verification={row.verification} />
      </td>
      <td className={CELL}>{formatJoined(row.joinedAt)}</td>
      <td className="h-14 px-4">
        <UserStatusPill status={row.status} />
      </td>
    </tr>
  );
}
