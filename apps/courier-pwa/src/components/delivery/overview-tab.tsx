import type {DeliveryDetail} from "@/types/delivery-types";
import {AccessCodeCard} from "./access-code-card";
import {RouteCard} from "./route-card";

/** Overview tab: the locker access card above the pickup→dropoff route. */
export function OverviewTab({delivery}: {delivery: DeliveryDetail}) {
  return (
    <div className="mt-5 flex flex-col gap-4">
      <AccessCodeCard code={delivery.accessCode} />
      <RouteCard stops={delivery.stops} distanceKm={delivery.distanceKm} />
    </div>
  );
}
