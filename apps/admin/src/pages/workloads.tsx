import {useState} from "react";
import {BatchList} from "@/components/workloads/batch-list";
import {ParcelDetailDrawer} from "@/components/workloads/parcel-detail-drawer";
import {SafeItemDrawer} from "@/components/workloads/safe-item-drawer";
import {SafeList} from "@/components/workloads/safe-list";
import {useFlagFlow} from "@/components/workloads/use-flag-flow";
import {useParcelExport} from "@/components/workloads/use-parcel-export";
import {useParcelSelection} from "@/components/workloads/use-parcel-selection";
import {useWorkloadsFilters} from "@/components/workloads/use-workloads-filters";
import {WorkloadsError} from "@/components/workloads/workloads-error";
import {WorkloadsHeader} from "@/components/workloads/workloads-header";
import {WorkloadsList} from "@/components/workloads/workloads-list";
import {WorkloadsOverlays} from "@/components/workloads/workloads-overlays";
import {WorkloadsSkeleton} from "@/components/workloads/workloads-skeleton";
import {useWorkloadsQuery} from "@/queries/use-workloads-query";
import type {WorkloadListResponse} from "@/types/workloads-types";

interface RegionProps {
  data: WorkloadListResponse;
  selected: ReadonlySet<string>;
  filters: {tab: string; query: string; status: string; location: string};
  handlers: {
    onQuery: (v: string) => void;
    onStatus: (v: string) => void;
    onLocation: (v: string) => void;
    onToggleRow: (id: string, checked: boolean) => void;
    onToggleAll: (ids: string[], checked: boolean) => void;
    onOpen: (id: string) => void;
    onPage: (page: number) => void;
    onBulkExport: () => void;
    onBulkFlag: () => void;
    onClearSelection: () => void;
  };
}

function WorkloadsRegion({data, selected, filters, handlers}: RegionProps) {
  if (filters.tab === "safe") {
    return (
      <SafeList
        data={data}
        filters={{query: filters.query, status: filters.status}}
        onQuery={handlers.onQuery}
        onStatus={handlers.onStatus}
        onOpen={handlers.onOpen}
        onPage={handlers.onPage}
      />
    );
  }
  if (filters.tab === "batches") {
    return (
      <BatchList
        data={data}
        filters={{query: filters.query, status: filters.status, location: filters.location}}
        onQuery={handlers.onQuery}
        onStatus={handlers.onStatus}
        onLocation={handlers.onLocation}
        onPage={handlers.onPage}
      />
    );
  }
  return (
    <WorkloadsList
      data={data}
      selected={selected}
      filters={{query: filters.query, status: filters.status, location: filters.location}}
      onQuery={handlers.onQuery}
      onStatus={handlers.onStatus}
      onLocation={handlers.onLocation}
      onToggleRow={handlers.onToggleRow}
      onToggleAll={(checked) => handlers.onToggleAll(data.parcels?.items.map((row) => row.id) ?? [], checked)}
      onOpen={handlers.onOpen}
      onPage={handlers.onPage}
      onBulkExport={handlers.onBulkExport}
      onBulkFlag={handlers.onBulkFlag}
      onClearSelection={handlers.onClearSelection}
    />
  );
}

function ItemDrawer({
  tab,
  itemId,
  onClose,
  onFlag,
}: {
  tab: string;
  itemId: string | null;
  onClose: () => void;
  onFlag: (id: string) => void;
}) {
  if (tab === "safe") return <SafeItemDrawer itemId={itemId} onClose={onClose} onFlag={onFlag} />;
  return <ParcelDetailDrawer parcelId={itemId} onClose={onClose} onFlag={onFlag} />;
}

/** Operations console: Single Send parcels and SME batches — list, metrics, drawer, flag and track flows. */
export function WorkloadsPage() {
  const {filters, params, onQuery, onStatus, onLocation, onTab, onPage} = useWorkloadsFilters();
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const {selected, toggleRow, toggleAll, clear} = useParcelSelection();
  const flag = useFlagFlow(clear);
  const {exporting, exportParcels} = useParcelExport(params);
  const {data, isPending, isError, refetch, isRefetching} = useWorkloadsQuery(params);

  const handlers = {
    onQuery,
    onStatus,
    onLocation,
    onToggleRow: toggleRow,
    onToggleAll: toggleAll,
    onOpen: setDrawerId,
    onPage,
    onBulkExport: () => void exportParcels([...selected]),
    onBulkFlag: () => flag.openFlag([...selected]),
    onClearSelection: clear,
  };

  return (
    <div className="flex flex-col gap-4">
      <WorkloadsHeader
        tab={filters.tab}
        refreshing={isRefetching}
        exporting={exporting}
        onTab={onTab}
        onRefresh={() => void refetch()}
        onExport={() => void exportParcels()}
      />
      {isPending ? (
        <WorkloadsSkeleton />
      ) : isError || !data ? (
        <WorkloadsError onRetry={() => void refetch()} isRetrying={isRefetching} />
      ) : (
        <WorkloadsRegion data={data} selected={selected} filters={filters} handlers={handlers} />
      )}
      <WorkloadsOverlays
        drawer={<ItemDrawer tab={filters.tab} itemId={drawerId} onClose={() => setDrawerId(null)} onFlag={(id) => flag.openFlag([id])} />}
        noun={filters.tab === "safe" ? "item" : "parcel"}
        flag={flag}
      />
    </div>
  );
}
