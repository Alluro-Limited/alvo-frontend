import {useState} from "react";
import {Button, Dialog, DialogBackdrop, DialogPopup, DialogPortal} from "@alvo/ui";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {ParcelDetail} from "@/types/workloads-types";
import {useParcelDetailQuery} from "@/queries/use-parcel-detail-query";
import wlFlag from "@/assets/wl-flag.svg";
import {DrawerHeader} from "./drawer-header";
import {FlaggedBanner, ParcelStatusBanner} from "./parcel-banners";
import {ParcelInfoCard} from "./parcel-info-card";
import {ParcelTimeline} from "./parcel-timeline";
import {ParcelTrackMap} from "./parcel-track-map";

interface ParcelDetailDrawerProps {
  parcelId: string | null;
  onClose: () => void;
  onFlag: (id: string) => void;
}

function DrawerSkeleton() {
  return (
    <div className="animate-pulse space-y-3 p-4" aria-busy="true">
      <div className="h-16 rounded-lg bg-grey-200" />
      <div className="h-64 rounded-lg bg-white" />
      <div className="h-64 rounded-lg bg-white" />
    </div>
  );
}

function DrawerBody({parcel, onFlag}: {parcel: ParcelDetail; onFlag: () => void}) {
  return (
    <div className="flex-1 space-y-3 overflow-y-auto p-4">
      <ParcelStatusBanner status={parcel.status} note={parcel.statusNote} />
      {parcel.flag && <FlaggedBanner flag={parcel.flag} />}
      <ParcelInfoCard parcel={parcel} />
      <ParcelTimeline steps={parcel.timeline} />
      {parcel.flag ? (
        <Button variant="outline" className="w-full" disabled>
          {m["workloads.already_flagged"]()}
        </Button>
      ) : (
        <Button variant="outline" className="w-full" onClick={onFlag}>
          <img src={wlFlag} alt="" className="size-4" aria-hidden="true" />
          {m["workloads.flag_for_review"]()}
        </Button>
      )}
    </div>
  );
}

function DrawerError({onRetry}: {onRetry: () => void}) {
  return (
    <div className="flex flex-col items-center gap-3 p-8 text-center">
      <p className="text-sm text-grey-600">{m["workloads.drawer_error"]()}</p>
      <Button variant="outline" onClick={onRetry}>
        {m["workloads.retry"]()}
      </Button>
    </div>
  );
}

interface DrawerContentProps {
  parcel: ParcelDetail | undefined;
  isPending: boolean;
  isError: boolean;
  tracking: boolean;
  onFlag: (id: string) => void;
  onRetry: () => void;
}

function DrawerContent({parcel, isPending, isError, tracking, onFlag, onRetry}: DrawerContentProps) {
  return (
    <div className={cn("flex min-h-0 flex-col", tracking ? "w-[480px] shrink-0" : "flex-1")}>
      {isPending && <DrawerSkeleton />}
      {isError && <DrawerError onRetry={onRetry} />}
      {parcel && <DrawerBody parcel={parcel} onFlag={() => onFlag(parcel.id)} />}
    </div>
  );
}

/** Right slide-over with the parcel's details, timeline, flag action and optional tracking map. */
export function ParcelDetailDrawer({parcelId, onClose, onFlag}: ParcelDetailDrawerProps) {
  const [tracking, setTracking] = useState(false);
  const [lastParcelId, setLastParcelId] = useState(parcelId);
  if (lastParcelId !== parcelId) {
    // Reset the map panel whenever a different parcel opens or the drawer closes.
    setLastParcelId(parcelId);
    setTracking(false);
  }
  const {data: parcel, isPending, isError, refetch} = useParcelDetailQuery(parcelId);
  const trackingData = tracking ? parcel?.tracking : undefined;

  return (
    <Dialog open={parcelId !== null} onOpenChange={(next) => !next && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup
          className={cn(
            "top-0 right-0 left-auto flex h-full translate-x-0 -translate-y-0 flex-col overflow-hidden rounded-none bg-grey-100 transition-[width]",
            trackingData ? "w-[1000px] max-w-[calc(100vw-48px)]" : "w-[480px] max-w-full"
          )}
        >
          <DrawerHeader
            parcel={parcel}
            tracking={Boolean(trackingData)}
            hasTracking={Boolean(parcel?.tracking)}
            onToggleTracking={() => setTracking((v) => !v)}
          />
          <div className="flex min-h-0 flex-1">
            {trackingData && <ParcelTrackMap tracking={trackingData} className="m-4 mr-0 flex-1" />}
            {parcelId && (
              <DrawerContent
                parcel={parcel}
                isPending={isPending}
                isError={isError}
                tracking={Boolean(trackingData)}
                onFlag={onFlag}
                onRetry={() => void refetch()}
              />
            )}
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
