import {Clock, MapPin, Package} from "lucide-react";
import type {JobOffer} from "@/types/delivery-types";
import {m} from "@/paraglide/messages";

/** The package count / distance / pickup-deadline icon rows on an offer card. */
export function OfferMeta({offer}: {offer: JobOffer}) {
  return (
    <div className="mt-3 flex flex-col gap-2">
      <div className="flex gap-6">
        <span className="flex items-center gap-1.5 text-[12px] text-foreground">
          <Package className="size-4 text-primary-500" aria-hidden="true" />
          {`${offer.packages} ${m["jobs.packages"]()}`}
        </span>
        <span className="flex items-center gap-1.5 text-[12px] text-foreground">
          <MapPin className="size-4 text-primary-500" aria-hidden="true" />
          {`${offer.distanceKm} ${m["jobs.kilometer"]()}`}
        </span>
      </div>
      <span className="flex items-center gap-1.5 text-[12px] text-foreground">
        <Clock className="size-4 text-primary-500" aria-hidden="true" />
        {`${m["jobs.pickup_by"]()} ${offer.pickupBy} • ${m["jobs.deliver_by"]()} ${offer.deliverBy}`}
      </span>
    </div>
  );
}
