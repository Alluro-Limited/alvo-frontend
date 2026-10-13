import {ArrowRight, Box, Clock, MapPin, Package} from "lucide-react";
import type {CompletedDelivery} from "@/types/deliveries-types";
import {m} from "@/paraglide/messages";
import {cn} from "cnfast";

/** One completed delivery row: kind icon, id + payout, node→node, and the pkg/km/date meta. */
export function CompletedCard({delivery}: {delivery: CompletedDelivery}) {
  const speed = delivery.kind === "speed";

  return (
    <article className="border-b border-grey-100 py-4">
      <div className="flex items-center gap-3">
        <span className={cn("grid size-9 shrink-0 place-items-center rounded-[10px]", speed ? "bg-[#fdf4e5]" : "bg-primary-50")}>
          <Box className={cn("size-4.5", speed ? "text-[#d99a2b]" : "text-primary-500")} aria-hidden="true" />
        </span>
        <p className="min-w-0 flex-1 text-[14px] font-semibold">{delivery.id}</p>
        <p className="text-[14px] font-bold">₦{delivery.payout.toLocaleString("en-US")}</p>
      </div>
      <div className="mt-2.5 flex items-center gap-1.5 pl-12 text-[12px] text-grey-600">
        <span>{delivery.originNode}</span>
        <ArrowRight className="size-3.5 text-primary-500" aria-hidden="true" />
        <span>{delivery.destinationNode}</span>
      </div>
      <div className="mt-2 flex items-center gap-4 pl-12 text-[11px] text-grey-500">
        <span className="flex items-center gap-1">
          <Package className="size-3.5 text-primary-500" aria-hidden="true" />
          {`${delivery.packages} ${m["deliveries.pkgs"]()}`}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="size-3.5 text-primary-500" aria-hidden="true" />
          {`${delivery.distanceKm} ${m["jobs.km"]()}`}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="size-3.5 text-primary-500" aria-hidden="true" />
          {delivery.dateLabel}
        </span>
      </div>
    </article>
  );
}
