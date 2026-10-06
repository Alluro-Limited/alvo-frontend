import {useState} from "react";
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

/** Operations console for Single Send parcels — list, metrics, drawer, flag and track flows. */
export function WorkloadsPage() {
  const {filters, params, onQuery, onStatus, onNode, onTab, onPage} = useWorkloadsFilters();
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const {selected, toggleRow, toggleAll, clear} = useParcelSelection();
  const flag = useFlagFlow(clear);
  const {exporting, exportParcels} = useParcelExport(params);
  const {data, isPending, isError, refetch, isRefetching} = useWorkloadsQuery(params);

  const region = isPending ? (
    <WorkloadsSkeleton />
  ) : isError || !data ? (
    <WorkloadsError onRetry={() => void refetch()} isRetrying={isRefetching} />
  ) : (
    <WorkloadsList
      data={data}
      selected={selected}
      filters={{...filters, filterOptions: data.filters}}
      onQuery={onQuery}
      onStatus={onStatus}
      onNode={onNode}
      onToggleRow={toggleRow}
      onToggleAll={(checked) =>
        toggleAll(
          data.parcels.items.map((row) => row.id),
          checked
        )
      }
      onOpen={setDrawerId}
      onPage={onPage}
      onBulkExport={() => void exportParcels([...selected])}
      onBulkFlag={() => flag.openFlag([...selected])}
      onClearSelection={clear}
    />
  );

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
      {region}
      <WorkloadsOverlays drawerId={drawerId} flag={flag} onCloseDrawer={() => setDrawerId(null)} />
    </div>
  );
}
