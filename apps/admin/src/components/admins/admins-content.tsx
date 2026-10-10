import type {UseQueryResult} from "@tanstack/react-query";
import {Button} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import type {AdminListResponse} from "@/types/admins-types";
import type {useParcelSelection} from "@/components/workloads/use-parcel-selection";
import type {useAdminsFilters} from "./use-admins-filters";
import type {useAdminsOverlays} from "./use-admins-overlays";
import {AdminsList} from "./admins-list";
import {AdminsMetrics} from "./admins-metrics";
import {AdminsSkeleton} from "./admins-skeleton";
import {AdminsToolbar} from "./admins-toolbar";

interface AdminsContentProps {
  filters: ReturnType<typeof useAdminsFilters>;
  selection: ReturnType<typeof useParcelSelection>;
  list: UseQueryResult<AdminListResponse>;
  overlays: ReturnType<typeof useAdminsOverlays>;
}

/** Everything under the page header — KPI cards, the toolbar, and the admin table states. */
export function AdminsContent({filters, selection, list, overlays}: AdminsContentProps) {
  if (list.isPending) return <AdminsSkeleton />;
  if (list.isError || !list.data) return <AdminsError retrying={list.isRefetching} onRetry={() => void list.refetch()} />;
  const data = list.data;

  return (
    <div className="flex flex-col gap-6">
      <AdminsMetrics metrics={data.metrics} />
      <AdminsToolbar
        query={filters.query}
        status={filters.status}
        role={filters.role}
        onQuery={filters.onQuery}
        onStatus={filters.onStatus}
        onRole={filters.onRole}
      />
      <AdminsList
        data={data}
        filtered={filters.filtered}
        selected={selection.selected}
        page={filters.page}
        onPage={filters.onPage}
        onToggleRow={selection.toggleRow}
        onToggleAll={(checked) =>
          selection.toggleAll(
            data.admins.items.map((row) => row.id),
            checked
          )
        }
        onOpen={overlays.openDrawer}
        onClearFilter={filters.clearFilters}
      />
    </div>
  );
}

function AdminsError({retrying, onRetry}: {retrying: boolean; onRetry: () => void}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-grey-300 bg-white py-20"
      data-testid="admins-error"
    >
      <p className="text-sm font-medium text-black">{m["admins.error_title"]()}</p>
      <Button variant="outline" isLoading={retrying} onClick={onRetry} className="h-9 px-4">
        {m["admins.retry"]()}
      </Button>
    </div>
  );
}
