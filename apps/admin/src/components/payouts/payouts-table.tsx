import {Checkbox} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import type {PayoutRow} from "@/types/payouts-types";
import {formatNairaAmount} from "@/lib/format";
import {PayoutStatusPill} from "./payout-status-pill";

const HEADERS: {key: string; label: () => string; width: string}[] = [
  {key: "id", label: m["payout.col_id"], width: "w-[110px]"},
  {key: "name", label: m["payout.col_name"], width: "w-[200px]"},
  {key: "account", label: m["payout.col_account"], width: "w-[160px]"},
  {key: "bank", label: m["payout.col_bank"], width: "w-[200px]"},
  {key: "deliveries", label: m["payout.col_deliveries"], width: "w-[100px]"},
  {key: "payout", label: m["payout.col_payout"], width: ""},
  {key: "status", label: m["payout.col_status"], width: ""},
];

const CELL = "h-14 overflow-clip px-4 text-sm leading-[1.4] tracking-[0.14px] text-ellipsis whitespace-nowrap text-grey-600";
const HEAD_CELL = "h-12 px-4 text-left text-sm leading-[1.4] font-medium tracking-[0.14px] whitespace-nowrap text-black";

interface PayoutsTableProps {
  rows: PayoutRow[];
  selected: ReadonlySet<string>;
  onToggleRow: (id: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
  onOpen: (id: string) => void;
}

/** The courier payout table — selectable rows; clicking a row opens the payout drawer. */
export function PayoutsTable({rows, selected, onToggleRow, onToggleAll, onOpen}: PayoutsTableProps) {
  const allChecked = rows.length > 0 && rows.every((row) => selected.has(row.courierId));
  return (
    <table className="w-full border border-grey-200" aria-label={m["payout.title"]()}>
      <thead>
        <tr className="bg-grey-100">
          <th className="w-[30px] py-4 pl-4">
            <Checkbox
              checked={allChecked}
              onCheckedChange={(checked) => onToggleAll(checked === true)}
              aria-label={m["payout.col_status"]()}
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
          <PayoutTableRow
            key={row.courierId}
            row={row}
            checked={selected.has(row.courierId)}
            onToggle={(checked) => onToggleRow(row.courierId, checked)}
            onOpen={() => onOpen(row.courierId)}
          />
        ))}
      </tbody>
    </table>
  );
}

function PayoutTableRow({
  row,
  checked,
  onToggle,
  onOpen,
}: {
  row: PayoutRow;
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
        <Checkbox checked={checked} onCheckedChange={(value) => onToggle(value === true)} aria-label={row.courierId} className="size-3.5" />
      </td>
      <td className={CELL}>{row.courierId}</td>
      <td className={CELL}>{row.name}</td>
      <td className={CELL}>{row.accountNumber}</td>
      <td className={CELL}>{row.bankName}</td>
      <td className={CELL}>{row.deliveries}</td>
      <td className={`${CELL} font-medium text-black`}>{`₦${formatNairaAmount(row.netPayout)}`}</td>
      <td className="h-14 px-4">
        <PayoutStatusPill status={row.status} />
      </td>
    </tr>
  );
}
