import {m} from "@/paraglide/messages";
import type {Page, ParcelRow, ParcelStatus, WorkloadFilterOptions} from "@/types/workloads-types";
import wlEmptyBox from "@/assets/wl-empty-box.svg";
import {ParcelTableRegion} from "./parcel-table-region";
import {SelectionBar} from "./selection-bar";
import {STATUS_LABELS} from "./status-labels";
import {WorkloadsEmpty} from "./workloads-empty";
import {WorkloadsError} from "./workloads-error";
import {WorkloadsToolbar} from "./workloads-toolbar";

interface BatchParcelSectionProps {
  parcels: Page<ParcelRow> | undefined;
  isPending: boolean;
  isError: boolean;
  isRetrying: boolean;
  onRetry: () => void;
  filterOptions: WorkloadFilterOptions;
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

function ParcelRowsSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-clip rounded-lg border border-grey-200 bg-white" aria-busy="true">
      <div className="h-14 w-full bg-grey-200" />
      {Array.from({length: 8}, (_, i) => (
        <div key={i} className="h-14 border-t border-grey-200" />
      ))}
    </div>
  );
}

/** Toolbar-or-selection-bar + the batch parcel table/empty + pagination on the batch detail page. */
export function BatchParcelSection(props: BatchParcelSectionProps) {
  const {parcels, isPending, isError, isRetrying, onRetry, filterOptions, selected, filters} = props;
  return (
    <>
      {selected.size > 0 ? (
        <SelectionBar count={selected.size} onExport={props.onBulkExport} onFlag={props.onBulkFlag} onClear={props.onClearSelection} />
      ) : (
        <WorkloadsToolbar
          query={filters.query}
          status={filters.status}
          location={filters.location}
          searchPlaceholder={m["workloads.search_placeholder"]()}
          statusOptions={filterOptions.statuses.map((id) => ({id, label: STATUS_LABELS[id as ParcelStatus]?.() ?? id}))}
          locationOptions={filterOptions.locations}
          onQuery={props.onQuery}
          onStatus={props.onStatus}
          onLocation={props.onLocation}
        />
      )}
      {isPending ? (
        <ParcelRowsSkeleton />
      ) : isError || !parcels ? (
        <WorkloadsError onRetry={onRetry} isRetrying={isRetrying} />
      ) : parcels.items.length === 0 ? (
        <WorkloadsEmpty
          icon={wlEmptyBox}
          title={m["workloads.batch_parcels_empty_title"]()}
          description={m["workloads.batch_parcels_empty_description"]()}
        />
      ) : (
        <ParcelTableRegion
          parcels={parcels}
          variant="batch"
          noun={m["workloads.noun_parcels"]()}
          selected={selected}
          onToggleRow={props.onToggleRow}
          onToggleAll={props.onToggleAll}
          onOpen={props.onOpen}
          onPage={props.onPage}
        />
      )}
    </>
  );
}
