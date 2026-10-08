import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import {formatCompactNaira, formatCount, formatPct, formatUptime, uptimeTone} from "@/lib/format-revenue";
import type {NodeRevenueRow} from "@/types/revenue-types";
import {PageNumbers} from "@/components/workloads/page-numbers";
import nodeEmptyIcon from "@/assets/rev-node-empty.svg";

const UPTIME_TONES = {
  good: "text-status-success-dark",
  warn: "text-status-warning-dark",
  bad: "text-status-fail-dark",
} as const;

const COLUMNS = [
  m["revenue.col_rank"](),
  m["revenue.col_node"](),
  m["revenue.col_revenue"](),
  m["revenue.col_pct"](),
  m["revenue.col_parcels"](),
  m["revenue.col_uptime"](),
];

/** Centered empty panel inside the table card — icon + copy per the Figma empty state. */
function NodesEmpty() {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-20 text-center" data-testid="nodes-empty">
      <img src={nodeEmptyIcon} alt="" className="size-12" aria-hidden="true" />
      <div className="flex max-w-md flex-col gap-1.5">
        <p className="text-base leading-[1.4] font-medium text-primary-800">{m["revenue.nodes_empty_title"]()}</p>
        <p className="text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{m["revenue.nodes_empty_description"]()}</p>
      </div>
    </div>
  );
}

/** One ranked node row — the uptime cell colors by the 96%/95% thresholds. */
function NodeRow({row}: {row: NodeRevenueRow}) {
  return (
    <tr className="border-t border-grey-300" data-testid="node-row">
      <td className="px-4 py-3.5 text-sm font-medium text-grey-600">#{row.rank}</td>
      <td className="px-4 py-3.5 text-sm font-medium text-primary-800">{row.node}</td>
      <td className="px-4 py-3.5 text-sm text-primary-800">₦{formatCompactNaira(row.revenue)}</td>
      <td className="px-4 py-3.5 text-sm text-grey-600">{formatPct(row.pctOfTotal)}</td>
      <td className="px-4 py-3.5 text-sm text-grey-600">{formatCount(row.parcels)}</td>
      <td className={cn("px-4 py-3.5 text-sm font-medium", UPTIME_TONES[uptimeTone(row.uptime)])}>
        {row.uptime === 0 ? "—" : formatUptime(row.uptime)}
      </td>
    </tr>
  );
}

/** "Total from N nodes · X parcels · ₦Y" plus numbered pagination and Previous/Next. */
function NodesFooter({
  totals,
  page,
  pageSize,
  total,
  onPage,
}: {
  totals: {nodes: number; parcels: number; revenue: number};
  page: number;
  pageSize: number;
  total: number;
  onPage: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <footer className="flex items-center justify-between border-t border-grey-300 px-4 py-2.5">
      <p className="flex items-center gap-2 text-sm leading-[1.4] tracking-[0.14px] text-grey-600" data-testid="nodes-totals">
        <span>{m["revenue.nodes_summary"]({nodes: formatCount(totals.nodes)})}</span>
        <span className="size-1 rounded-full bg-grey-300" aria-hidden="true" />
        <span>{m["revenue.parcels_summary"]({count: formatCount(totals.parcels)})}</span>
        <span className="size-1 rounded-full bg-grey-300" aria-hidden="true" />
        <span className="font-medium text-primary-800">₦{formatCompactNaira(totals.revenue)}</span>
      </p>
      <div className="flex items-center gap-3">
        <PageNumbers page={page} totalPages={totalPages} onPage={onPage} />
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          className="h-9 rounded-md border border-grey-300 px-4 text-sm font-medium text-grey-600 disabled:opacity-40"
        >
          {m["revenue.page_previous"]()}
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPage(page + 1)}
          className="h-9 rounded-md border border-primary-500 px-4 text-sm font-medium text-primary-500 disabled:opacity-40"
        >
          {m["revenue.page_next"]()}
        </button>
      </div>
    </footer>
  );
}

interface NodesTableCardProps {
  nodes: {items: NodeRevenueRow[]; page: number; pageSize: number; total: number};
  totals: {nodes: number; parcels: number; revenue: number};
  onPage: (page: number) => void;
}

/** The ranked node table inside its card — rows, totals strip, pagination. */
export function NodesTableCard({nodes, totals, onPage}: NodesTableCardProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-grey-300 bg-white" data-testid="nodes-table-card">
      {nodes.items.length === 0 ? (
        <NodesEmpty />
      ) : (
        <>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F7F9FC]">
                {COLUMNS.map((column) => (
                  <th key={column} className="px-4 py-3 text-xs leading-[1.4] font-medium tracking-[0.12px] text-grey-500">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {nodes.items.map((row) => (
                <NodeRow key={row.nodeId} row={row} />
              ))}
            </tbody>
          </table>
          <NodesFooter totals={totals} page={nodes.page} pageSize={nodes.pageSize} total={nodes.total} onPage={onPage} />
        </>
      )}
    </section>
  );
}
