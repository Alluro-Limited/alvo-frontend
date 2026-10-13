import {useState} from "react";
import {useNavigate, useParams} from "@tanstack/react-router";
import {ChevronLeft} from "lucide-react";
import {AccessScreen} from "@/components/activities/access-screen";
import {CollectedCard} from "@/components/activities/collected-card";
import {DetailsTabs} from "@/components/activities/details-tabs";
import type {DetailsAction} from "@/components/activities/details-tabs";
import {ExtendSheet} from "@/components/activities/extend-sheet";
import {PackageInfoSheet} from "@/components/activities/package-info-sheet";
import {SafeBody} from "@/components/activities/safe-body";
import {StatusCard} from "@/components/activities/status-card";
import {StorageSheet} from "@/components/activities/storage-sheet";
import {SummaryCard} from "@/components/activities/summary-card";
import {TimelineSheet} from "@/components/activities/timeline-sheet";
import {NotFoundPage} from "@/pages/not-found";
import {useDeliveryQuery} from "@/queries/use-activity-queries";
import type {ActivityKind, DeliveryDetail} from "@/types/activity-types";
import {m} from "@/paraglide/messages";

/** Delivery details — status + summary with Details/Access/Timeline tiles, and collected layout for done states. */
export function DeliveryPage() {
  const {id} = useParams({from: "/delivery/$id"});
  const navigate = useNavigate();
  const query = useDeliveryQuery(id);
  const [sheet, setSheet] = useState<"info" | "timeline" | null>(null);
  const [codeView, setCodeView] = useState(false);
  const [extendOpen, setExtendOpen] = useState(false);

  const delivery = query.data;
  if (!query.isLoading && !delivery) return <NotFoundPage />;
  if (delivery && codeView) return <AccessScreen delivery={delivery} isFetching={query.isFetching} onBack={() => setCodeView(false)} />;

  const onAction = (action: DetailsAction) => (action === "access" ? setCodeView(true) : setSheet(action === "info" ? "info" : "timeline"));

  return (
    <main className="flex w-full flex-col bg-white px-6 pb-[max(32px,env(safe-area-inset-bottom))] pt-[65px]">
      <DeliveryHeader kind={delivery?.kind} onBack={() => void navigate({to: "/activities"})} />
      {query.isLoading || !delivery ? (
        <DeliverySkeleton />
      ) : (
        <DeliveryBody
          delivery={delivery}
          onAction={onAction}
          onExtend={() => setExtendOpen(true)}
          onSupport={() => void navigate({to: "/support"})}
        />
      )}
      {delivery ? (
        <DeliveryOverlays
          delivery={delivery}
          sheet={sheet}
          extendOpen={extendOpen}
          onCloseSheet={() => setSheet(null)}
          onCloseExtend={() => setExtendOpen(false)}
        />
      ) : null}
    </main>
  );
}

function DeliveryOverlays({
  delivery,
  sheet,
  extendOpen,
  onCloseSheet,
  onCloseExtend,
}: {
  delivery: DeliveryDetail;
  sheet: "info" | "timeline" | null;
  extendOpen: boolean;
  onCloseSheet: () => void;
  onCloseExtend: () => void;
}) {
  return (
    <>
      {delivery.kind !== "safe" ? <PackageInfoSheet open={sheet === "info"} onClose={onCloseSheet} info={delivery.info} /> : null}
      {delivery.storage ? <StorageSheet open={sheet === "info"} onClose={onCloseSheet} storage={delivery.storage} /> : null}
      <TimelineSheet open={sheet === "timeline"} onClose={onCloseSheet} events={delivery.timeline} />
      {delivery.kind === "safe" ? (
        <ExtendSheet open={extendOpen} deliveryId={delivery.id} remaining={delivery.extensionsRemaining} onClose={onCloseExtend} />
      ) : null}
    </>
  );
}

function DeliveryHeader({kind, onBack}: {kind?: ActivityKind; onBack: () => void}) {
  return (
    <div className="flex w-full items-center justify-center">
      <button
        type="button"
        onClick={onBack}
        aria-label={m["auth.back"]()}
        className="mr-auto -ml-1 flex size-8 items-center justify-center rounded-full bg-white"
      >
        <ChevronLeft className="size-6" aria-hidden="true" />
      </button>
      <h1 className="mr-auto text-[14px] font-medium leading-[1.4] text-foreground">
        {kind === "safe" ? m["del.safe_title"]() : m["del.title"]()}
      </h1>
    </div>
  );
}

function DeliverySkeleton() {
  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="skeleton h-[49px] w-full rounded-full" />
      <div className="skeleton h-44 w-full rounded-2xl" />
      <div className="skeleton h-32 w-full rounded-2xl" />
      <div className="skeleton h-12 w-full rounded-[10px]" />
    </div>
  );
}

function DeliveryBody({
  delivery,
  onAction,
  onExtend,
  onSupport,
}: {
  delivery: DeliveryDetail;
  onAction: (a: DetailsAction) => void;
  onExtend: () => void;
  onSupport: () => void;
}) {
  if (delivery.kind === "safe") return <SafeBody delivery={delivery} onAction={onAction} onExtend={onExtend} onSupport={onSupport} />;
  const collected = delivery.status === "collected" || delivery.status === "complete" || delivery.status === "cancelled";
  return (
    <>
      {collected ? <CollectedCard delivery={delivery} /> : <StatusCard delivery={delivery} />}
      <DetailsTabs onAction={onAction} />
      <SummaryCard delivery={delivery} />
      <button
        type="button"
        onClick={onSupport}
        className="mt-4 flex h-[50px] w-full items-center justify-center rounded-[8px] bg-[#f2f2f2] px-5 text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-primary-500"
      >
        {m["del.support"]()}
      </button>
    </>
  );
}
