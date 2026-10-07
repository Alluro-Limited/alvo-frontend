import type {UseQueryResult} from "@tanstack/react-query";
import type {ListMapView} from "@/components/view-tabs";
import {WorkloadsError} from "@/components/workloads/workloads-error";
import type {useParcelSelection} from "@/components/workloads/use-parcel-selection";
import type {CourierListResponse} from "@/types/couriers-types";
import {CouriersList} from "./couriers-list";
import {CouriersMapView} from "./couriers-map-view";
import {CouriersSkeleton} from "./couriers-skeleton";
import type {useCourierExport} from "./use-courier-export";
import type {useCourierFlagFlow} from "./use-courier-flag-flow";
import type {useCourierOverlays} from "./use-courier-overlays";
import type {useCourierSuspendFlow} from "./use-courier-suspend-flow";
import type {useCouriersFilters} from "./use-couriers-filters";

export interface CouriersPageContentProps {
  view: ListMapView;
  filters: ReturnType<typeof useCouriersFilters>;
  selection: ReturnType<typeof useParcelSelection>;
  list: UseQueryResult<CourierListResponse>;
  overlays: ReturnType<typeof useCourierOverlays>;
  flag: ReturnType<typeof useCourierFlagFlow>;
  suspend: ReturnType<typeof useCourierSuspendFlow>;
  exporter: ReturnType<typeof useCourierExport>;
  onView: (view: ListMapView) => void;
}

/** The body under the header — pending/error shells first, then the list or map region. */
export function CouriersPageContent({view, filters, selection, list, overlays, flag, suspend, exporter, onView}: CouriersPageContentProps) {
  if (view === "map") {
    return (
      <CouriersMapView
        params={filters.mapParams}
        filtered={filters.filtered}
        filters={list.data?.filters ?? {statuses: [], verifications: [], vehicles: []}}
        onQuery={filters.onQuery}
        onStatus={filters.onStatus}
        onVerification={filters.onVerification}
        onVehicle={filters.onVehicle}
        onView={onView}
        onOpen={overlays.openDrawer}
        onClearFilters={filters.clearFilters}
      />
    );
  }
  if (list.isPending) return <CouriersSkeleton />;
  if (list.isError || !list.data) return <WorkloadsError onRetry={() => void list.refetch()} isRetrying={list.isRefetching} />;
  return (
    <CouriersList
      data={list.data}
      selected={selection.selected}
      filters={filters.filters}
      filtered={filters.filtered}
      onQuery={filters.onQuery}
      onStatus={filters.onStatus}
      onVerification={filters.onVerification}
      onVehicle={filters.onVehicle}
      onToggleRow={selection.toggleRow}
      onToggleAll={selection.toggleAll}
      onOpen={overlays.openDrawer}
      onPage={filters.onPage}
      onClearFilters={filters.clearFilters}
      onBulkExport={() => void exporter.exportCouriers([...selection.selected])}
      onBulkFlag={() => flag.openFlag([...selection.selected])}
      onBulkSuspend={() => suspend.openBulkSuspend([...selection.selected])}
      onClearSelection={selection.clear}
    />
  );
}
