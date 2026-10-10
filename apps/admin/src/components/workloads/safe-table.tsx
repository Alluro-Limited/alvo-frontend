import {m} from "@/paraglide/messages";
import type {SafeItemRow} from "@/types/workloads-types";
import wlFlag from "@/assets/wl-flag.svg";
import {SafeStatusTag} from "./safe-status-tag";
import {formatStoredAgo} from "./workloads-format";

const HEADERS: {key: string; label: () => string; width: string}[] = [
  {key: "item", label: m["workloads.col_item_id"], width: "w-[140px]"},
  {key: "owner", label: m["workloads.col_owner"], width: "w-[200px]"},
  {key: "node", label: m["workloads.col_node"], width: "w-[140px]"},
  {key: "stored", label: m["workloads.col_stored"], width: "w-[140px]"},
  {key: "status", label: m["workloads.col_status"], width: "w-[160px]"},
];

const CELL = "h-12 overflow-clip px-4 text-sm leading-[1.4] tracking-[0.14px] text-ellipsis whitespace-nowrap text-grey-600";
const HEAD_CELL = "h-12 px-4 text-left text-sm leading-[1.4] font-medium tracking-[0.14px] whitespace-nowrap text-black";

/** The Safe storage table — rows open the item drawer; flagged rows carry the amber flag on the Item ID. */
export function SafeTable({rows, onOpen}: {rows: SafeItemRow[]; onOpen: (id: string) => void}) {
  return (
    <table className="w-full border border-grey-200" aria-label={m["workloads.tab_safe"]()}>
      <thead>
        <tr className="bg-grey-100">
          {HEADERS.map((header) => (
            <th key={header.key} className={`${HEAD_CELL} ${header.width}`}>
              {header.label()}
            </th>
          ))}
          <th className="w-12" aria-hidden="true" />
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={row.id}
            onClick={() => onOpen(row.id)}
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onOpen(row.id);
              }
            }}
            className="cursor-pointer border-t border-grey-200 bg-white transition-colors hover:bg-grey-100/60"
          >
            <td className={CELL}>
              <span className="inline-flex items-center gap-1.5">
                {row.flagged && <img src={wlFlag} alt={m["workloads.flagged_tag"]()} className="size-3.5" />}
                {row.id}
              </span>
            </td>
            <td className={CELL}>{row.owner}</td>
            <td className={CELL}>{row.nodeId}</td>
            <td className={CELL}>{formatStoredAgo(row.storedAt)}</td>
            <td className="h-12 px-4">
              <SafeStatusTag status={row.status} />
            </td>
            <td className="w-12" aria-hidden="true" />
          </tr>
        ))}
      </tbody>
    </table>
  );
}
