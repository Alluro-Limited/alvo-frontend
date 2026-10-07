import {m} from "@/paraglide/messages";
import usersEmpty from "@/assets/users-empty.svg";
import usersMenuLock from "@/assets/users-menu-lock.svg";
import {SelectionBar} from "@/components/workloads/selection-bar";
import {WorkloadsEmpty} from "@/components/workloads/workloads-empty";
import {WorkloadsPagination} from "@/components/workloads/workloads-pagination";
import type {CourierListResponse} from "@/types/couriers-types";
import {courierFilterOptions} from "./courier-labels";
import {CouriersMetrics} from "./couriers-metrics";
import {CouriersTable} from "./couriers-table";
import {CouriersToolbar} from "./couriers-toolbar";

interface CourierFilters {
  query: string;
  status: string;
  verification: string;
  vehicle: string;
}

interface CouriersListProps {
  data: CourierListResponse;
  selected: ReadonlySet<string>;
  filters: CourierFilters;
  /** Any filter/search is active — controls which empty state shows. */
  filtered: boolean;
  onQuery: (value: string) => void;
  onStatus: (value: string) => void;
  onVerification: (value: string) => void;
  onVehicle: (value: string) => void;
  onToggleRow: (id: string, checked: boolean) => void;
  onToggleAll: (ids: string[], checked: boolean) => void;
  onOpen: (id: string) => void;
  onPage: (page: number) => void;
  onClearFilters: () => void;
  onBulkExport: () => void;
  onBulkFlag: () => void;
  onBulkSuspend: () => void;
  onClearSelection: () => void;
}

/** The populated/empty body under the couriers header — metrics, filters, then the table. */
export function CouriersList({data, selected, filters, filtered, onClearFilters, ...handlers}: CouriersListProps) {
  const options = courierFilterOptions(data.filters);

  return (
    <div className="flex flex-col gap-4">
      <CouriersMetrics metrics={data.metrics} />
      <FilterBar
        selectedCount={selected.size}
        filters={filters}
        options={options}
        onQuery={handlers.onQuery}
        onStatus={handlers.onStatus}
        onVerification={handlers.onVerification}
        onVehicle={handlers.onVehicle}
        onBulkExport={handlers.onBulkExport}
        onBulkFlag={handlers.onBulkFlag}
        onBulkSuspend={handlers.onBulkSuspend}
        onClearSelection={handlers.onClearSelection}
      />
      <ContentRegion
        data={data}
        filtered={filtered}
        selected={selected}
        onToggleRow={handlers.onToggleRow}
        onToggleAll={handlers.onToggleAll}
        onOpen={handlers.onOpen}
        onPage={handlers.onPage}
        onClearFilters={onClearFilters}
      />
    </div>
  );
}

interface FilterBarProps extends Pick<
  CouriersListProps,
  "filters" | "onQuery" | "onStatus" | "onVerification" | "onVehicle" | "onBulkExport" | "onBulkFlag" | "onBulkSuspend" | "onClearSelection"
> {
  selectedCount: number;
  options: ReturnType<typeof courierFilterOptions>;
}

/** The search/filter strip — replaced by the bulk-action bar while rows are selected. */
function FilterBar({
  selectedCount,
  filters,
  options,
  onQuery,
  onStatus,
  onVerification,
  onVehicle,
  onBulkExport,
  onBulkFlag,
  onBulkSuspend,
  onClearSelection,
}: FilterBarProps) {
  if (selectedCount > 0) {
    return (
      <SelectionBar
        count={selectedCount}
        onExport={onBulkExport}
        onFlag={onBulkFlag}
        onDestructive={{label: m["couriers.menu_suspend"](), icon: usersMenuLock, onClick: onBulkSuspend}}
        onClear={onClearSelection}
      />
    );
  }
  return (
    <CouriersToolbar
      query={filters.query}
      status={filters.status}
      verification={filters.verification}
      vehicle={filters.vehicle}
      statusOptions={options.statusOptions}
      verificationOptions={options.verificationOptions}
      vehicleOptions={options.vehicleOptions}
      onQuery={onQuery}
      onStatus={onStatus}
      onVerification={onVerification}
      onVehicle={onVehicle}
    />
  );
}

type ContentRegionProps = Pick<
  CouriersListProps,
  "data" | "selected" | "onToggleRow" | "onToggleAll" | "onOpen" | "onPage" | "onClearFilters"
> & {filtered: boolean};

/** Empty states first, then the table. */
function ContentRegion({data, filtered, selected, onToggleRow, onToggleAll, onOpen, onPage, onClearFilters}: ContentRegionProps) {
  const rows = data.couriers.items;
  if (rows.length === 0) {
    return filtered ? (
      <WorkloadsEmpty
        icon={usersEmpty}
        title={m["couriers.filtered_empty_title"]()}
        description={m["couriers.filtered_empty_description"]()}
        action={{label: m["couriers.clear_filter"](), onClick: onClearFilters}}
      />
    ) : (
      <WorkloadsEmpty icon={usersEmpty} title={m["couriers.empty_title"]()} description={m["couriers.empty_description"]()} />
    );
  }
  return (
    <div className="overflow-clip rounded-lg bg-white">
      <CouriersTable
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
        page={data.couriers.page}
        pageSize={data.couriers.pageSize}
        total={data.couriers.total}
        itemCount={rows.length}
        noun={m["couriers.noun"]()}
        onPage={onPage}
      />
    </div>
  );
}
