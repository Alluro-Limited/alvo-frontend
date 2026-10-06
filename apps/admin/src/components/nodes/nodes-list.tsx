import {m} from "@/paraglide/messages";
import wlEmptyBox from "@/assets/wl-empty-box.svg";
import {WorkloadsEmpty} from "@/components/workloads/workloads-empty";
import {WorkloadsPagination} from "@/components/workloads/workloads-pagination";
import {WorkloadsToolbar, type FilterOption} from "@/components/workloads/workloads-toolbar";
import type {NodeListResponse, NodeStatus} from "@/types/nodes-types";
import {NODE_STATUS_LABELS} from "./node-status-labels";
import {NodesMap} from "./nodes-map";
import {NodesMetrics} from "./nodes-metrics";
import {NodesTable} from "./nodes-table";
import type {NodesView} from "./nodes-view-tabs";

interface NodesListProps {
  data: NodeListResponse;
  view: NodesView;
  selected: ReadonlySet<string>;
  filters: {query: string; status: string};
  onQuery: (value: string) => void;
  onStatus: (value: string) => void;
  onToggleRow: (id: string, checked: boolean) => void;
  onToggleAll: (ids: string[], checked: boolean) => void;
  onOpen: (id: string) => void;
  onPage: (page: number) => void;
  onClearFilters: () => void;
  onRegister: () => void;
}

/** The populated/empty body under the nodes header — metrics, filters, then the list or map. */
export function NodesList({
  data,
  view,
  selected,
  filters,
  onQuery,
  onStatus,
  onToggleRow,
  onToggleAll,
  onOpen,
  onPage,
  onClearFilters,
  onRegister,
}: NodesListProps) {
  const rows = data.nodes.items;
  const statusOptions: FilterOption[] = data.filters.statuses.map((status) => ({
    id: status,
    label: NODE_STATUS_LABELS[status as NodeStatus]?.() ?? status,
  }));
  const filtered = filters.query !== "" || filters.status !== "";

  return (
    <div className="flex flex-col gap-4">
      <NodesMetrics metrics={data.metrics} />
      <WorkloadsToolbar
        query={filters.query}
        status={filters.status}
        searchPlaceholder={m["nodes.search_placeholder"]()}
        statusOptions={statusOptions}
        onQuery={onQuery}
        onStatus={onStatus}
      />
      {rows.length === 0 ? (
        <EmptyRegion filtered={filtered} onClearFilters={onClearFilters} onRegister={onRegister} />
      ) : view === "map" ? (
        <NodesMap rows={rows} onOpen={onOpen} />
      ) : (
        <TableRegion
          data={data}
          rows={rows}
          selected={selected}
          onToggleRow={onToggleRow}
          onToggleAll={onToggleAll}
          onOpen={onOpen}
          onPage={onPage}
        />
      )}
    </div>
  );
}

type TableRegionProps = Pick<NodesListProps, "data" | "selected" | "onToggleRow" | "onToggleAll" | "onOpen" | "onPage"> & {
  rows: NodeListResponse["nodes"]["items"];
};

function TableRegion({data, rows, selected, onToggleRow, onToggleAll, onOpen, onPage}: TableRegionProps) {
  return (
    <div className="overflow-clip rounded-lg bg-white">
      <NodesTable
        rows={rows}
        selected={selected}
        onToggleRow={onToggleRow}
        onToggleAll={(checked) =>
          onToggleAll(
            rows.map((row) => row.id),
            checked
          )
        }
        onOpen={onOpen}
      />
      <WorkloadsPagination
        page={data.nodes.page}
        pageSize={data.nodes.pageSize}
        total={data.nodes.total}
        itemCount={rows.length}
        noun="nodes"
        onPage={onPage}
      />
    </div>
  );
}

function EmptyRegion({filtered, onClearFilters, onRegister}: {filtered: boolean; onClearFilters: () => void; onRegister: () => void}) {
  if (filtered) {
    return (
      <WorkloadsEmpty
        icon={wlEmptyBox}
        title={m["nodes.filtered_empty_title"]()}
        description={m["nodes.filtered_empty_description"]()}
        action={{label: m["nodes.clear_filter"](), onClick: onClearFilters}}
      />
    );
  }
  return (
    <WorkloadsEmpty
      icon={wlEmptyBox}
      title={m["nodes.empty_title"]()}
      description={m["nodes.empty_description"]()}
      action={{label: m["nodes.empty_action"](), onClick: onRegister}}
    />
  );
}
