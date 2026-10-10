import {m} from "@/paraglide/messages";
import type {SafeItemStatus, WorkloadListResponse} from "@/types/workloads-types";
import wlEmptyBox from "@/assets/wl-empty-box.svg";
import {SAFE_STATUS_LABELS} from "./safe-status-labels";
import {SafeTable} from "./safe-table";
import {WorkloadsEmpty} from "./workloads-empty";
import {WorkloadsMetrics} from "./workloads-metrics";
import {WorkloadsPagination} from "./workloads-pagination";
import {WorkloadsToolbar} from "./workloads-toolbar";

interface SafeListProps {
  data: WorkloadListResponse;
  filters: {query: string; status: string};
  onQuery: (v: string) => void;
  onStatus: (v: string) => void;
  onOpen: (id: string) => void;
  onPage: (page: number) => void;
}

function SafeEmpty({filtered, onClearFilters}: {filtered: boolean; onClearFilters: () => void}) {
  if (filtered) {
    return (
      <WorkloadsEmpty
        icon={wlEmptyBox}
        title={m["workloads.safe_filtered_empty_title"]()}
        description={m["workloads.safe_filtered_empty_description"]()}
        action={{label: m["workloads.clear_filter"](), onClick: onClearFilters}}
      />
    );
  }
  return (
    <WorkloadsEmpty icon={wlEmptyBox} title={m["workloads.safe_empty_title"]()} description={m["workloads.safe_empty_description"]()} />
  );
}

/** Metrics strip + status filter + item table + pagination for the Safe tab. */
export function SafeList({data, filters, onQuery, onStatus, onOpen, onPage}: SafeListProps) {
  const items = data.safeItems;
  const filtered = Boolean(filters.query || filters.status);
  const clearFilters = () => {
    onQuery("");
    onStatus("");
  };
  return (
    <>
      <WorkloadsMetrics metrics={data.metrics} />
      <WorkloadsToolbar
        query={filters.query}
        status={filters.status}
        searchPlaceholder={m["workloads.search_placeholder_safe"]()}
        statusOptions={data.filters.statuses.map((id) => ({id, label: SAFE_STATUS_LABELS[id as SafeItemStatus]?.() ?? id}))}
        onQuery={onQuery}
        onStatus={onStatus}
      />
      {!items || items.items.length === 0 ? (
        <SafeEmpty filtered={filtered} onClearFilters={clearFilters} />
      ) : (
        <div className="overflow-clip rounded-lg bg-white">
          <SafeTable rows={items.items} onOpen={onOpen} />
          <WorkloadsPagination
            page={items.page}
            pageSize={items.pageSize}
            total={items.total}
            itemCount={items.items.length}
            noun={m["workloads.noun_items"]()}
            onPage={onPage}
          />
        </div>
      )}
    </>
  );
}
