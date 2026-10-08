import {useState} from "react";
import type {ListMapView} from "@/components/view-tabs";
import {useParcelSelection} from "@/components/workloads/use-parcel-selection";
import {CouriersHeader} from "@/components/couriers/couriers-header";
import {CouriersOverlays} from "@/components/couriers/couriers-overlays";
import {CouriersPageContent} from "@/components/couriers/couriers-page-content";
import {useCourierApproveFlow} from "@/components/couriers/use-courier-approve-flow";
import {useCourierDeleteFlow} from "@/components/couriers/use-courier-delete-flow";
import {useCourierExport} from "@/components/couriers/use-courier-export";
import {useCourierFlagFlow} from "@/components/couriers/use-courier-flag-flow";
import {useCourierOverlays} from "@/components/couriers/use-courier-overlays";
import {useCourierSuspendFlow} from "@/components/couriers/use-courier-suspend-flow";
import {useCouriersFilters} from "@/components/couriers/use-couriers-filters";
import {useCouriersQuery} from "@/queries/use-couriers-query";

/** The Courier Management page — metrics, filters, the couriers table/map, drawer, and account actions. */
export function CouriersPage() {
  const [view, setView] = useState<ListMapView>("list");
  const filters = useCouriersFilters();
  const selection = useParcelSelection();
  const list = useCouriersQuery(filters.listParams);

  const overlays = useCourierOverlays();
  const flag = useCourierFlagFlow(selection.clear);
  const suspend = useCourierSuspendFlow(selection.clear);
  const del = useCourierDeleteFlow(overlays.closeDrawer);
  const approve = useCourierApproveFlow();
  const exporter = useCourierExport(filters.exportParams);

  return (
    <div className="flex flex-col gap-4">
      <CouriersHeader
        view={view}
        refreshing={list.isRefetching}
        exporting={exporter.exporting}
        onView={setView}
        onRefresh={() => void list.refetch()}
        onExport={() => void exporter.exportCouriers()}
      />
      <CouriersPageContent
        view={view}
        filters={filters}
        selection={selection}
        list={list}
        overlays={overlays}
        flag={flag}
        suspend={suspend}
        exporter={exporter}
        onView={setView}
      />
      <CouriersOverlays
        overlays={overlays}
        flag={flag}
        suspend={suspend}
        del={del}
        approve={approve}
        suspendReasons={list.data?.suspendReasons ?? []}
        deleteReasons={list.data?.deleteReasons ?? []}
        exporting={exporter.exporting}
        onExportHistory={exporter.exportAssignments}
      />
    </div>
  );
}
