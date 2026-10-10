import {m} from "@/paraglide/messages";
import wlEmptyBox from "@/assets/wl-empty-box.svg";
import {SelectionBar} from "@/components/workloads/selection-bar";
import {WorkloadsEmpty} from "@/components/workloads/workloads-empty";
import {WorkloadsPagination} from "@/components/workloads/workloads-pagination";
import {WorkloadsToolbar, type FilterOption} from "@/components/workloads/workloads-toolbar";
import type {AssignmentListResponse} from "@/types/assignment-types";
import {assignmentFilterOptions} from "./assignment-labels";
import {AssignmentMetrics} from "./assignment-metrics";
import {AssignmentTable} from "./assignment-table";
import {AssignmentTypeCards} from "./assignment-type-cards";

interface AssignmentListProps {
  data: AssignmentListResponse;
  selected: ReadonlySet<string>;
  filters: {query: string; status: string; type: string};
  onQuery: (value: string) => void;
  onStatus: (value: string) => void;
  onType: (value: string) => void;
  onToggleRow: (id: string, checked: boolean) => void;
  onToggleAll: (ids: string[], checked: boolean) => void;
  onOpen: (id: string) => void;
  onPage: (page: number) => void;
  onClearFilters: () => void;
  onBulkFlag: () => void;
  onClearSelection: () => void;
}

/** The populated/empty body under the assignment header — metrics, type cards, filters, then the table. */
export function AssignmentList({
  data,
  selected,
  filters,
  onQuery,
  onStatus,
  onType,
  onToggleRow,
  onToggleAll,
  onOpen,
  onPage,
  onClearFilters,
  onBulkFlag,
  onClearSelection,
}: AssignmentListProps) {
  const {statusOptions, typeOptions} = assignmentFilterOptions(data.filters);
  const filtered = filters.query !== "" || filters.status !== "" || filters.type !== "";

  return (
    <div className="flex flex-col gap-4">
      <AssignmentMetrics metrics={data.metrics} />
      <AssignmentTypeCards />
      <FilterBar
        selectedCount={selected.size}
        statusOptions={statusOptions}
        typeOptions={typeOptions}
        filters={filters}
        onQuery={onQuery}
        onStatus={onStatus}
        onType={onType}
        onBulkFlag={onBulkFlag}
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

type ContentRegionProps = Pick<
  AssignmentListProps,
  "data" | "selected" | "onToggleRow" | "onToggleAll" | "onOpen" | "onPage" | "onClearFilters"
> & {filtered: boolean};

/** Empty states first, then the table. */
function ContentRegion({data, filtered, selected, onToggleRow, onToggleAll, onOpen, onPage, onClearFilters}: ContentRegionProps) {
  const rows = data.assignments.items;
  if (rows.length === 0) return <EmptyRegion filtered={filtered} onClearFilters={onClearFilters} />;
  return (
    <TableRegion
      data={data}
      rows={rows}
      selected={selected}
      onToggleRow={onToggleRow}
      onToggleAll={onToggleAll}
      onOpen={onOpen}
      onPage={onPage}
    />
  );
}

interface FilterBarProps extends Pick<
  AssignmentListProps,
  "filters" | "onQuery" | "onStatus" | "onType" | "onBulkFlag" | "onClearSelection"
> {
  selectedCount: number;
  statusOptions: FilterOption[];
  typeOptions: FilterOption[];
}

/** The search/filter strip — replaced by the bulk-action bar while rows are selected. */
function FilterBar({
  selectedCount,
  statusOptions,
  typeOptions,
  filters,
  onQuery,
  onStatus,
  onType,
  onBulkFlag,
  onClearSelection,
}: FilterBarProps) {
  if (selectedCount > 0) return <SelectionBar count={selectedCount} onFlag={onBulkFlag} onClear={onClearSelection} />;
  return (
    <WorkloadsToolbar
      query={filters.query}
      status={filters.status}
      searchPlaceholder={m["assignment.search_placeholder"]()}
      statusOptions={statusOptions}
      location={filters.type}
      locationOptions={typeOptions}
      secondAriaLabel={m["assignment.filter_type_aria"]()}
      onQuery={onQuery}
      onStatus={onStatus}
      onLocation={onType}
    />
  );
}

type TableRegionProps = Pick<AssignmentListProps, "data" | "selected" | "onToggleRow" | "onToggleAll" | "onOpen" | "onPage"> & {
  rows: AssignmentListResponse["assignments"]["items"];
};

function TableRegion({data, rows, selected, onToggleRow, onToggleAll, onOpen, onPage}: TableRegionProps) {
  return (
    <div className="overflow-clip rounded-lg bg-white">
      <AssignmentTable
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
        page={data.assignments.page}
        pageSize={data.assignments.pageSize}
        total={data.assignments.total}
        itemCount={rows.length}
        noun="deliveries"
        onPage={onPage}
      />
    </div>
  );
}

function EmptyRegion({filtered, onClearFilters}: {filtered: boolean; onClearFilters: () => void}) {
  if (filtered) {
    return (
      <WorkloadsEmpty
        icon={wlEmptyBox}
        title={m["assignment.filtered_empty_title"]()}
        description={m["assignment.filtered_empty_description"]()}
        action={{label: m["assignment.clear_filter"](), onClick: onClearFilters}}
      />
    );
  }
  return <WorkloadsEmpty icon={wlEmptyBox} title={m["assignment.empty_title"]()} description={m["assignment.empty_description"]()} />;
}
