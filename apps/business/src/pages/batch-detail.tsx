import {m} from "@/paraglide/messages";
import {useBatchDetailQuery, useShipmentTrackingQuery} from "@/queries/use-batch-queries";
import {useSetPageTitle} from "@/components/app-shell/page-title";
import {BatchInfoCard} from "@/components/batch-detail/batch-info-card";
import {BatchShipmentsTable} from "@/components/batch-detail/batch-shipments-table";
import {BatchSidePanel} from "@/components/batch-detail/batch-side-panel";
import {DeliveredBanner} from "@/components/batch-detail/delivered-banner";
import {TrackingOverlay} from "@/components/batch-detail/tracking-overlay";
import {useBatchDetail} from "@/components/batch-detail/use-batch-detail";
import {BatchFilterBar} from "@/components/batches/batch-filter";

function DetailSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[1100px] animate-pulse flex-col gap-6">
      <div className="h-[330px] rounded-lg border-[0.75px] border-grey-200 bg-white" />
      <div className="h-[52px] rounded-lg border border-grey-200 bg-white" />
      <div className="h-[364px] rounded-3xl border border-grey-200 bg-white" />
    </div>
  );
}

function BatchDetailContent({batchId}: {batchId: string}) {
  const {data: batch, isLoading} = useBatchDetailQuery(batchId);
  useSetPageTitle(batch?.name ?? null);
  if (isLoading || !batch) return <DetailSkeleton />;
  return <BatchDetailView batch={batch} />;
}

function BatchDetailView({batch}: {batch: Parameters<typeof useBatchDetail>[0]}) {
  const detail = useBatchDetail(batch);
  const {data: tracking} = useShipmentTrackingQuery(detail.trackingId);
  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-6">
      {batch.allDelivered && <DeliveredBanner />}
      <BatchInfoCard batch={batch} />
      <div className="flex items-start gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <BatchFilterBar
            filter={detail.filter}
            onFilter={detail.setFilter}
            search={detail.search}
            onSearch={detail.setSearch}
            placeholder={m["batches.search_recipient_ph"]()}
          />
          <BatchShipmentsTable shipments={detail.filtered} onTrack={detail.setTrackingId} />
        </div>
        <BatchSidePanel batch={batch} />
      </div>
      {tracking && <TrackingOverlay tracking={tracking} onClose={() => detail.setTrackingId(null)} />}
    </div>
  );
}

/** `/shipments/$batchId` — one batch: summary card, shipments table, delivery + cost panels. */
export function BatchDetailPage({batchId}: {batchId: string}) {
  return <BatchDetailContent batchId={batchId} />;
}
