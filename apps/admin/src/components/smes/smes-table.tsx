import {Checkbox} from "@alvo/ui";
import {formatJoined} from "@/lib/format";
import {m} from "@/paraglide/messages";
import type {SmeRow} from "@/types/smes-types";
import {SmeStatusPill} from "./sme-status-pill";
import {SmeVerificationPill} from "./sme-verification-pill";

const HEADERS: {key: string; label: () => string; width: string}[] = [
  {key: "id", label: m["smes.col_id"], width: "w-[120px]"},
  {key: "name", label: m["smes.col_name"], width: "w-[200px]"},
  {key: "industry", label: m["smes.col_industry"], width: "w-[160px]"},
  {key: "location", label: m["smes.col_location"], width: "w-[180px]"},
  {key: "verification", label: m["smes.col_verification"], width: "w-[130px]"},
  {key: "joined", label: m["smes.col_joined"], width: "w-[130px]"},
  {key: "status", label: m["smes.col_status"], width: "w-[130px]"},
];

const CELL = "h-14 overflow-clip px-4 text-sm leading-[1.4] tracking-[0.14px] text-ellipsis whitespace-nowrap text-grey-600";
const HEAD_CELL = "h-12 px-4 text-left text-sm leading-[1.4] font-medium tracking-[0.14px] whitespace-nowrap text-black";

interface SmesTableProps {
  rows: SmeRow[];
  selected: ReadonlySet<string>;
  onToggleRow: (id: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
  onOpen: (id: string) => void;
}

/** The SMEs table — selectable rows; clicking a row opens the business drawer. */
export function SmesTable({rows, selected, onToggleRow, onToggleAll, onOpen}: SmesTableProps) {
  const allChecked = rows.length > 0 && rows.every((row) => selected.has(row.id));
  return (
    <table className="w-full border border-grey-200" aria-label={m["smes.title"]()}>
      <thead>
        <tr className="bg-grey-100">
          <th className="w-[30px] py-4 pl-4">
            <Checkbox
              checked={allChecked}
              onCheckedChange={(checked) => onToggleAll(checked === true)}
              aria-label={m["smes.col_status"]()}
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
          <SmesTableRow
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

function SmesTableRow({
  row,
  checked,
  onToggle,
  onOpen,
}: {
  row: SmeRow;
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
      <td className={CELL}>{row.businessName}</td>
      <td className={CELL}>{row.industry}</td>
      <td className={CELL}>{row.location}</td>
      <td className="h-14 px-4">
        <SmeVerificationPill verification={row.verification} />
      </td>
      <td className={CELL}>{formatJoined(row.joinedAt)}</td>
      <td className="h-14 px-4">
        <SmeStatusPill status={row.status} />
      </td>
    </tr>
  );
}
