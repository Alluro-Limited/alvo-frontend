import {m} from "@/paraglide/messages";
import usersEmpty from "@/assets/users-empty.svg";
import usersMenuLock from "@/assets/users-menu-lock.svg";
import {SelectionBar} from "@/components/workloads/selection-bar";
import {WorkloadsEmpty} from "@/components/workloads/workloads-empty";
import {WorkloadsPagination} from "@/components/workloads/workloads-pagination";
import {WorkloadsToolbar, type FilterOption} from "@/components/workloads/workloads-toolbar";
import type {UserListResponse} from "@/types/users-types";
import {userFilterOptions} from "./user-labels";
import {UsersMetrics} from "./users-metrics";
import {UsersTable} from "./users-table";

interface UsersListProps {
  data: UserListResponse;
  selected: ReadonlySet<string>;
  filters: {query: string; status: string; verification: string};
  onQuery: (value: string) => void;
  onStatus: (value: string) => void;
  onVerification: (value: string) => void;
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

/** The populated/empty body under the users header — metrics, filters, then the table. */
export function UsersList({
  data,
  selected,
  filters,
  onQuery,
  onStatus,
  onVerification,
  onToggleRow,
  onToggleAll,
  onOpen,
  onPage,
  onClearFilters,
  onBulkExport,
  onBulkFlag,
  onBulkSuspend,
  onClearSelection,
}: UsersListProps) {
  const {statusOptions, verificationOptions} = userFilterOptions(data.filters);
  const filtered = filters.query !== "" || filters.status !== "" || filters.verification !== "";

  return (
    <div className="flex flex-col gap-4">
      <UsersMetrics metrics={data.metrics} />
      <FilterBar
        selectedCount={selected.size}
        statusOptions={statusOptions}
        verificationOptions={verificationOptions}
        filters={filters}
        onQuery={onQuery}
        onStatus={onStatus}
        onVerification={onVerification}
        onBulkExport={onBulkExport}
        onBulkFlag={onBulkFlag}
        onBulkSuspend={onBulkSuspend}
        onClearSelection={onClearSelection}
      />
      <ContentRegion
        data={data}
        filtered={filtered}
        selected={selected}
        onToggleRow={onToggleRow}
        onToggleAll={onToggleAll}
        onOpen={onOpen}
        onPage={onPage}
        onClearFilters={onClearFilters}
      />
    </div>
  );
}

interface FilterBarProps extends Pick<
  UsersListProps,
  "filters" | "onQuery" | "onStatus" | "onVerification" | "onBulkExport" | "onBulkFlag" | "onBulkSuspend" | "onClearSelection"
> {
  selectedCount: number;
  statusOptions: FilterOption[];
  verificationOptions: FilterOption[];
}

/** The search/filter strip — replaced by the bulk-action bar while rows are selected. */
function FilterBar({
  selectedCount,
  statusOptions,
  verificationOptions,
  filters,
  onQuery,
  onStatus,
  onVerification,
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
        onDestructive={{label: m["users.menu_suspend"](), icon: usersMenuLock, onClick: onBulkSuspend}}
        onClear={onClearSelection}
      />
    );
  }
  return (
    <WorkloadsToolbar
      query={filters.query}
      status={filters.status}
      searchPlaceholder={m["users.search_placeholder"]()}
      statusOptions={statusOptions}
      location={filters.verification}
      locationOptions={verificationOptions}
      secondAriaLabel={m["users.filter_verification_aria"]()}
      onQuery={onQuery}
      onStatus={onStatus}
      onLocation={onVerification}
    />
  );
}

type ContentRegionProps = Pick<
  UsersListProps,
  "data" | "selected" | "onToggleRow" | "onToggleAll" | "onOpen" | "onPage" | "onClearFilters"
> & {filtered: boolean};

/** Empty states first, then the table. */
function ContentRegion({data, filtered, selected, onToggleRow, onToggleAll, onOpen, onPage, onClearFilters}: ContentRegionProps) {
  const rows = data.users.items;
  if (rows.length === 0) {
    return filtered ? (
      <WorkloadsEmpty
        icon={usersEmpty}
        title={m["users.filtered_empty_title"]()}
        description={m["users.filtered_empty_description"]()}
        action={{label: m["users.clear_filter"](), onClick: onClearFilters}}
      />
    ) : (
      <WorkloadsEmpty icon={usersEmpty} title={m["users.empty_title"]()} description={m["users.empty_description"]()} />
    );
  }
  return (
    <div className="overflow-clip rounded-lg bg-white">
      <UsersTable
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
        page={data.users.page}
        pageSize={data.users.pageSize}
        total={data.users.total}
        itemCount={rows.length}
        noun={m["users.noun"]()}
        onPage={onPage}
      />
    </div>
  );
}
