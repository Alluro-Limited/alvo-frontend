import type {UseQueryResult} from "@tanstack/react-query";
import {Checkbox, StatusTag} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import type {Page} from "@/types/workloads-types";
import type {CourierAssignment, CourierAssignmentStatus} from "@/types/couriers-types";
import wlEmptyBox from "@/assets/wl-empty-box.svg";
import {AssignmentTypePill} from "@/components/assignment/assignment-type-pill";
import {DrawerError} from "@/components/workloads/drawer-error";
import {DrawerSkeleton} from "@/components/workloads/drawer-skeleton";
import {WorkloadsEmpty} from "@/components/workloads/workloads-empty";
import {WorkloadsPagination} from "@/components/workloads/workloads-pagination";
import {formatJoinedLong} from "@/lib/format";

const CELL = "h-14 overflow-clip px-4 text-sm leading-[1.4] tracking-[0.14px] text-ellipsis whitespace-nowrap text-grey-600";
const HEAD_CELL = "h-12 px-4 text-left text-sm leading-[1.4] font-medium tracking-[0.14px] whitespace-nowrap text-black";

const HEADERS: {key: string; label: () => string}[] = [
  {key: "date", label: m["couriers.history_col_date"]},
  {key: "id", label: m["couriers.history_col_id"]},
  {key: "type", label: m["couriers.history_col_type"]},
  {key: "pickup", label: m["couriers.history_col_pickup"]},
  {key: "dropoff", label: m["couriers.history_col_dropoff"]},
  {key: "items", label: m["couriers.history_col_items"]},
  {key: "status", label: m["couriers.history_col_status"]},
];

const STATUS_TAGS: Record<CourierAssignmentStatus, "success" | "default" | "fail"> = {
  completed: "success",
  cancelled: "default",
  failed: "fail",
};
const STATUS_LABELS: Record<CourierAssignmentStatus, () => string> = {
  completed: m["couriers.history_status_completed"],
  cancelled: m["couriers.history_status_cancelled"],
  failed: m["couriers.history_status_failed"],
};

interface HistoryBodyProps {
  filtered: boolean;
  assignments: UseQueryResult<Page<CourierAssignment>>;
  selected: ReadonlySet<string>;
  onToggleRow: (id: string, checked: boolean) => void;
  onToggleAll: (ids: string[], checked: boolean) => void;
  onClear: () => void;
  onPage: (page: number) => void;
}

/** Pending/error/empty shells first, then the date-labeled assignment table with pagination. */
export function HistoryBody({filtered, assignments, selected, onToggleRow, onToggleAll, onClear, onPage}: HistoryBodyProps) {
  if (assignments.isPending) return <DrawerSkeleton />;
  if (assignments.isError || !assignments.data)
    return <DrawerError message={m["couriers.history_error"]()} onRetry={() => void assignments.refetch()} />;
  const data = assignments.data;
  if (data.items.length === 0) return <EmptyState filtered={filtered} onClear={onClear} />;
  return (
    <>
      <div className="overflow-clip rounded-lg border border-grey-200">
        <HistoryTable rows={data.items} selected={selected} onToggleRow={onToggleRow} onToggleAll={onToggleAll} />
      </div>
      <WorkloadsPagination
        page={data.page}
        pageSize={data.pageSize}
        total={data.total}
        itemCount={data.items.length}
        noun={m["couriers.history_noun"]()}
        onPage={onPage}
      />
    </>
  );
}

function EmptyState({filtered, onClear}: {filtered: boolean; onClear: () => void}) {
  return (
    <WorkloadsEmpty
      icon={wlEmptyBox}
      title={filtered ? m["couriers.history_filtered_empty"]() : m["couriers.history_empty_title"]()}
      description={filtered ? m["couriers.filtered_empty_description"]() : m["couriers.history_empty_description"]()}
      action={filtered ? {label: m["couriers.clear_filter"](), onClick: onClear} : undefined}
    />
  );
}

interface HistoryTableProps {
  rows: CourierAssignment[];
  selected: ReadonlySet<string>;
  onToggleRow: (id: string, checked: boolean) => void;
  onToggleAll: (ids: string[], checked: boolean) => void;
}

function HistoryTable({rows, selected, onToggleRow, onToggleAll}: HistoryTableProps) {
  const allChecked = rows.length > 0 && rows.every((row) => selected.has(row.id));
  return (
    <table className="w-full" aria-label={m["couriers.tab_assignments"]()}>
      <thead>
        <tr className="bg-grey-100">
          <th className="w-[30px] py-4 pl-4">
            <Checkbox
              checked={allChecked}
              onCheckedChange={(checked) =>
                onToggleAll(
                  rows.map((row) => row.id),
                  checked === true
                )
              }
              aria-label={m["couriers.history_col_status"]()}
              className="size-3.5"
            />
          </th>
          {HEADERS.map((header) => (
            <th key={header.key} className={HEAD_CELL}>
              {header.label()}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <HistoryRow key={row.id} row={row} checked={selected.has(row.id)} onToggle={(checked) => onToggleRow(row.id, checked)} />
        ))}
      </tbody>
    </table>
  );
}

function HistoryRow({row, checked, onToggle}: {row: CourierAssignment; checked: boolean; onToggle: (checked: boolean) => void}) {
  return (
    <tr className="border-t border-grey-200 bg-white">
      <td className="py-4 pl-4">
        <Checkbox checked={checked} onCheckedChange={(value) => onToggle(value === true)} aria-label={row.id} className="size-3.5" />
      </td>
      <td className={CELL}>{formatJoinedLong(row.date)}</td>
      <td className={`${CELL} font-medium text-black`}>{row.id}</td>
      <td className="h-14 px-4">
        <AssignmentTypePill type={row.type} />
      </td>
      <td className={CELL}>{row.pickup}</td>
      <td className={CELL}>{row.dropoff}</td>
      <td className={CELL}>
        {row.items === 1 ? m["couriers.history_items_one"]({count: row.items}) : m["couriers.history_items"]({count: row.items})}
      </td>
      <td className="h-14 px-4">
        <StatusTag status={STATUS_TAGS[row.status]}>{STATUS_LABELS[row.status]()}</StatusTag>
      </td>
    </tr>
  );
}
