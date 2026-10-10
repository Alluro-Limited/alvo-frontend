import {useState} from "react";
import {Button} from "@alvo/ui";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {ParcelDetail} from "@/types/workloads-types";
import {useParcelDetailQuery} from "@/queries/use-parcel-detail-query";
import wlFlag from "@/assets/wl-flag.svg";
import {DrawerError} from "./drawer-error";
import {DrawerHeader} from "./drawer-header";
import {DrawerShell} from "./drawer-shell";
import {DrawerSkeleton} from "./drawer-skeleton";
import {FlaggedBanner, ParcelStatusBanner} from "./parcel-banners";
import {ParcelInfoCard} from "./parcel-info-card";
import {ParcelTimeline} from "./parcel-timeline";
import {ParcelTrackMap} from "./parcel-track-map";

interface ParcelDetailDrawerProps {
  parcelId: string | null;
  onClose: () => void;
  onFlag: (id: string) => void;
}

function DrawerBody({parcel, onFlag}: {parcel: ParcelDetail; onFlag: () => void}) {
  return (
    <div className="flex-1 space-y-3 overflow-y-auto p-4">
      <ParcelStatusBanner status={parcel.status} note={parcel.statusNote} />
      {parcel.flag && <FlaggedBanner flag={parcel.flag} />}
      <ParcelInfoCard parcel={parcel} />
      <ParcelTimeline routes={parcel.routes} />
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
      {isError && <DrawerError message={m["workloads.drawer_error"]()} onRetry={onRetry} />}
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
    <DrawerShell open={parcelId !== null} onClose={onClose} wide={Boolean(trackingData)}>
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
    </DrawerShell>
  );
}
