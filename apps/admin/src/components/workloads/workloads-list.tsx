import {m} from "@/paraglide/messages";
import type {ParcelStatus, WorkloadFilterOptions, WorkloadListResponse} from "@/types/workloads-types";
import wlEmptyBox from "@/assets/wl-empty-box.svg";
import {ParcelTableRegion} from "./parcel-table-region";
import {SelectionBar} from "./selection-bar";
import {STATUS_LABELS} from "./status-labels";
import {WorkloadsEmpty} from "./workloads-empty";
import {WorkloadsMetrics} from "./workloads-metrics";
import {WorkloadsToolbar} from "./workloads-toolbar";

interface WorkloadsListProps {
  data: WorkloadListResponse;
  selected: ReadonlySet<string>;
  filters: {query: string; status: string; location: string};
  onQuery: (v: string) => void;
  onStatus: (v: string) => void;
  onLocation: (v: string) => void;
  onToggleRow: (id: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
  onOpen: (id: string) => void;
  onPage: (page: number) => void;
  onBulkExport: () => void;
  onBulkFlag: () => void;
  onClearSelection: () => void;
}

function FiltersRow({
  filters,
  options,
  selected,
  onQuery,
  onStatus,
  onLocation,
  onBulkExport,
  onBulkFlag,
  onClearSelection,
}: Pick<
  WorkloadsListProps,
  "filters" | "selected" | "onQuery" | "onStatus" | "onLocation" | "onBulkExport" | "onBulkFlag" | "onClearSelection"
> & {options: WorkloadFilterOptions}) {
  if (selected.size > 0) {
    return <SelectionBar count={selected.size} onExport={onBulkExport} onFlag={onBulkFlag} onClear={onClearSelection} />;
  }
  return (
    <WorkloadsToolbar
      query={filters.query}
      status={filters.status}
      location={filters.location}
      searchPlaceholder={m["workloads.search_placeholder"]()}
      statusOptions={options.statuses.map((id) => ({id, label: STATUS_LABELS[id as ParcelStatus]?.() ?? id}))}
      locationOptions={options.locations}
      onQuery={onQuery}
      onStatus={onStatus}
      onLocation={onLocation}
    />
  );
}

/** Metrics strip + toolbar-or-selection-bar + table/empty + pagination for Single Send. */
export function WorkloadsList(props: WorkloadsListProps) {
  const {data, selected, onToggleRow, onToggleAll, onOpen, onPage} = props;
  const parcels = data.parcels;
  return (
    <>
      <WorkloadsMetrics metrics={data.metrics} />
      <FiltersRow {...props} options={data.filters} />
      {!parcels || parcels.items.length === 0 ? (
        <WorkloadsEmpty icon={wlEmptyBox} title={m["workloads.empty_title"]()} description={m["workloads.empty_description"]()} />
      ) : (
        <ParcelTableRegion
          parcels={parcels}
          variant="single"
          noun={m["workloads.noun_deliveries"]()}
          selected={selected}
          onToggleRow={onToggleRow}
          onToggleAll={onToggleAll}
          onOpen={onOpen}
          onPage={onPage}
        />
      )}
    </>
  );
}
