import {Checkbox} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import type {NodeRow} from "@/types/nodes-types";
import {NodeConnectivityCell} from "./node-connectivity";
import {NodeStatusTag} from "./node-status-tag";

const HEADERS: {key: string; label: () => string; width: string}[] = [
  {key: "id", label: m["nodes.col_node_id"], width: "w-[130px]"},
  {key: "name", label: m["nodes.col_name"], width: "w-[190px]"},
  {key: "partner", label: m["nodes.col_partner"], width: "w-[160px]"},
  {key: "zone", label: m["nodes.col_zone"], width: "w-[130px]"},
  {key: "capacity", label: m["nodes.col_capacity"], width: "w-[100px]"},
  {key: "network", label: m["nodes.col_network"], width: "w-[150px]"},
  {key: "status", label: m["nodes.col_status"], width: "w-[150px]"},
];

const CELL = "h-12 overflow-clip px-4 text-sm leading-[1.4] tracking-[0.14px] text-ellipsis whitespace-nowrap text-grey-600";
const HEAD_CELL = "h-12 px-4 text-left text-sm leading-[1.4] font-medium tracking-[0.14px] whitespace-nowrap text-black";

interface NodesTableProps {
  rows: NodeRow[];
  selected: ReadonlySet<string>;
  onToggleRow: (id: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
  onOpen: (id: string) => void;
}

/** The nodes table — selectable rows; clicking a row opens the node detail page. */
export function NodesTable({rows, selected, onToggleRow, onToggleAll, onOpen}: NodesTableProps) {
  const allChecked = rows.length > 0 && rows.every((row) => selected.has(row.id));
  return (
    <table className="w-full border border-grey-200" aria-label={m["nav.nodes"]()}>
      <thead>
        <tr className="bg-grey-100">
          <th className="w-[30px] py-4 pl-4">
            <Checkbox
              checked={allChecked}
              onCheckedChange={(checked) => onToggleAll(checked === true)}
              aria-label={m["nodes.col_status"]()}
              className="size-3.5"
            />
          </th>
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
          <NodeTableRow
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

function NodeTableRow({
  row,
  checked,
  onToggle,
  onOpen,
}: {
  row: NodeRow;
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
      <td className={CELL}>{row.name}</td>
      <td className={CELL}>{row.partner}</td>
      <td className={CELL}>{row.zone}</td>
      <td className={CELL}>{m["nodes.capacity_used_total"]({used: row.capacity.used, total: row.capacity.total})}</td>
      <td className={CELL}>
        <NodeConnectivityCell connectivity={row.connectivity} />
      </td>
      <td className="h-12 px-4">
        <NodeStatusTag status={row.status} />
      </td>
      <td className="w-12" aria-hidden="true" />
    </tr>
  );
}
