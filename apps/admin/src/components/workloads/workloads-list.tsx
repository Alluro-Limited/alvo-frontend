import type {ParcelStatus, WorkloadFilterOptions, WorkloadListResponse} from "@/types/workloads-types";
import {SelectionBar} from "./selection-bar";
import {WorkloadsEmpty} from "./workloads-empty";
import {WorkloadsMetrics} from "./workloads-metrics";
import {WorkloadsPagination} from "./workloads-pagination";
import {WorkloadsTable} from "./workloads-table";
import {WorkloadsToolbar} from "./workloads-toolbar";

interface WorkloadsListProps {
  data: WorkloadListResponse;
  selected: ReadonlySet<string>;
  filters: {query: string; status: ParcelStatus | ""; nodeId: string; filterOptions: WorkloadFilterOptions};
  onQuery: (v: string) => void;
  onStatus: (v: ParcelStatus | "") => void;
  onNode: (v: string) => void;
  onToggleRow: (id: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
  onOpen: (id: string) => void;
  onPage: (page: number) => void;
  onBulkExport: () => void;
  onBulkFlag: () => void;
  onClearSelection: () => void;
}

/** Metrics strip + toolbar-or-selection-bar + table/empty + pagination. */
export function WorkloadsList({
  data,
  selected,
  filters,
  onQuery,
  onStatus,
  onNode,
  onToggleRow,
  onToggleAll,
  onOpen,
  onPage,
  onBulkExport,
  onBulkFlag,
  onClearSelection,
}: WorkloadsListProps) {
  const rows = data.parcels.items;
  return (
    <>
      <WorkloadsMetrics metrics={data.metrics} />
      {selected.size > 0 ? (
        <SelectionBar count={selected.size} onExport={onBulkExport} onFlag={onBulkFlag} onClear={onClearSelection} />
      ) : (
        <WorkloadsToolbar
          query={filters.query}
          status={filters.status}
          nodeId={filters.nodeId}
          filterOptions={filters.filterOptions}
          onQuery={onQuery}
          onStatus={onStatus}
          onNode={onNode}
        />
      )}
      {rows.length === 0 ? (
        <WorkloadsEmpty />
      ) : (
        <div className="overflow-clip rounded-lg bg-white">
          <WorkloadsTable rows={rows} selected={selected} onToggleRow={onToggleRow} onToggleAll={onToggleAll} onOpen={onOpen} />
          <WorkloadsPagination
            page={data.parcels.page}
            pageSize={data.parcels.pageSize}
            total={data.parcels.total}
            itemCount={rows.length}
            onPage={onPage}
          />
        </div>
      )}
    </>
  );
}
