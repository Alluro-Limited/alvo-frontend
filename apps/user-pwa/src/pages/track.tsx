import {useNavigate, useParams} from "@tanstack/react-router";
import {ChevronLeft} from "lucide-react";
import {TrackSheet} from "@/components/activities/track-sheet";
import {NotFoundPage} from "@/pages/not-found";
import {useDeliveryQuery} from "@/queries/use-activity-queries";
import {m} from "@/paraglide/messages";
import trackMapUrl from "@/assets/track-map.png";

/** Live tracking — full-bleed map with a floating header and the ETA bottom sheet. */
export function TrackPage() {
  const {id} = useParams({from: "/delivery/$id/track"});
  const navigate = useNavigate();
  const query = useDeliveryQuery(id);

  const delivery = query.data;
  if (!query.isLoading && !delivery) return <NotFoundPage />;

  return (
    <main className="relative flex h-dvh w-full flex-col overflow-hidden bg-white">
      <div className="absolute inset-0">
        <img src={trackMapUrl} alt="" aria-hidden="true" className="h-full w-full object-cover object-top" />
      </div>
      <div className="relative flex w-full items-center justify-center px-6 pt-[65px]">
        <button
          type="button"
          onClick={() => void navigate({to: "/delivery/$id", params: {id}})}
          aria-label={m["auth.back"]()}
          className="absolute left-6 flex size-8 items-center justify-center rounded-full bg-white"
        >
          <ChevronLeft className="size-6" aria-hidden="true" />
        </button>
        <h1 className="text-[14px] font-medium leading-[1.4] text-foreground">{m["del.title"]()}</h1>
      </div>
      {delivery ? <TrackSheet track={delivery.track} origin={delivery.origin} destination={delivery.destination} /> : null}
    </main>
  );
}
