import {useState} from "react";
import {useBatchParcelFilters} from "@/components/workloads/use-batch-parcel-filters";
import {useFlagFlow} from "@/components/workloads/use-flag-flow";
import {useParcelExport} from "@/components/workloads/use-parcel-export";
import {useParcelSelection} from "@/components/workloads/use-parcel-selection";
import {BatchDetailHeader} from "@/components/workloads/batch-detail-header";
import {BatchDetailSkeleton} from "@/components/workloads/batch-detail-skeleton";
import {BatchDetailTopbar} from "@/components/workloads/batch-detail-topbar";
import {BatchParcelSection} from "@/components/workloads/batch-parcel-section";
import {WorkloadsError} from "@/components/workloads/workloads-error";
import {WorkloadsMetrics} from "@/components/workloads/workloads-metrics";
import {WorkloadsOverlays} from "@/components/workloads/workloads-overlays";
import {useBatchDetailQuery} from "@/queries/use-batch-detail-query";
import {useBatchParcelsQuery} from "@/queries/use-batch-parcels-query";
import type {WorkloadFilterOptions} from "@/types/workloads-types";

interface ParcelHandlers {
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
}

interface ParcelsBlockProps {
  query: ReturnType<typeof useBatchParcelsQuery>;
  filterOptions: WorkloadFilterOptions;
  selected: ReadonlySet<string>;
  filters: {query: string; status: string; location: string};
  handlers: ParcelHandlers;
}

function ParcelsBlock({query, filterOptions, selected, filters, handlers}: ParcelsBlockProps) {
  const {onToggleAll, ...rest} = handlers;
  return (
    <BatchParcelSection
      parcels={query.data}
      isPending={query.isPending}
      isError={query.isError}
      isRetrying={query.isRefetching}
      onRetry={() => void query.refetch()}
      filterOptions={filterOptions}
      selected={selected}
      filters={filters}
      {...rest}
      onToggleAll={(checked) => onToggleAll(query.data?.items.map((row) => row.id) ?? [], checked)}
    />
  );
}

interface DetailBodyProps {
  detail: ReturnType<typeof useBatchDetailQuery>;
  parcels: ReturnType<typeof useBatchParcelsQuery>;
  selected: ReadonlySet<string>;
  filters: {query: string; status: string; location: string};
  handlers: ParcelHandlers;
  onRetry: () => void;
}

function DetailBody({detail, parcels, selected, filters, handlers, onRetry}: DetailBodyProps) {
  if (detail.isPending) return <BatchDetailSkeleton />;
  if (detail.isError || !detail.data) return <WorkloadsError onRetry={onRetry} isRetrying={detail.isRefetching} />;
  return (
    <>
      <BatchDetailHeader batch={detail.data} />
      <WorkloadsMetrics metrics={detail.data.metrics} />
      <ParcelsBlock query={parcels} filterOptions={detail.data.filters} selected={selected} filters={filters} handlers={handlers} />
    </>
  );
}

/** One SME batch: header + progress + metrics, then the parcels table with selection, flag and track flows. */
export function BatchDetailPage({batchId}: {batchId: string}) {
  const {params, filters, onQuery, onStatus, onLocation, onPage} = useBatchParcelFilters();
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const {selected, toggleRow, toggleAll, clear} = useParcelSelection();
  const flag = useFlagFlow(clear);
  const {exporting, exportParcels} = useParcelExport({...params, batchId});
  const detail = useBatchDetailQuery(batchId);
  const parcels = useBatchParcelsQuery(batchId, params);

  const refresh = () => {
    void detail.refetch();
    void parcels.refetch();
  };

  const handlers: ParcelHandlers = {
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
      <BatchDetailTopbar
        refreshing={detail.isRefetching || parcels.isRefetching}
        exporting={exporting}
        onRefresh={refresh}
        onExport={() => void exportParcels()}
      />
      <DetailBody detail={detail} parcels={parcels} selected={selected} filters={filters} handlers={handlers} onRetry={refresh} />
      <WorkloadsOverlays drawerId={drawerId} flag={flag} onCloseDrawer={() => setDrawerId(null)} />
    </div>
  );
}
