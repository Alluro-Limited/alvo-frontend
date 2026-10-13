import {Check, Map, Package} from "lucide-react";
import type {RouteStop} from "@/types/delivery-types";
import {m} from "@/paraglide/messages";

interface RouteCardProps {
  stops: RouteStop[];
  distanceKm: number;
}

/** The "Route" card: pickup→dropoff timeline, the distance pill, and the map action. */
export function RouteCard({stops, distanceKm}: RouteCardProps) {
  return (
    <section className="rounded-[14px] bg-grey-50 p-4">
      <h2 className="text-[15px] font-semibold">{m["job.route"]()}</h2>
      <ol className="mt-4">
        {stops.map((stop, i) => (
          <li key={stop.label} className="relative flex gap-3 pb-6 last:pb-0">
            {i < stops.length - 1 && <span className="absolute left-2 top-5 bottom-0 w-px bg-grey-300" aria-hidden="true" />}
            <RouteMarker kind={stop.kind} />
            <div>
              <p className="text-[12px] text-grey-500">{stop.label}</p>
              <p className="mt-0.5 text-[13px] font-semibold">{stop.address}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-5 flex items-center justify-between">
        <p className="flex items-center gap-1.5 rounded-full border border-primary-200 px-3 py-1.5 text-[12px] font-medium text-primary-600">
          <Package className="size-3.5" aria-hidden="true" />
          {`${distanceKm} ${m["jobs.km"]()}`}
        </p>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-[8px] bg-primary-50 px-4 py-2 text-[13px] font-semibold text-primary-600"
        >
          <Map className="size-4" aria-hidden="true" />
          {m["job.open_map"]()}
        </button>
      </div>
    </section>
  );
}

function RouteMarker({kind}: {kind: RouteStop["kind"]}) {
  if (kind === "pickup") {
    return (
      <span className="relative grid size-4 shrink-0 place-items-center rounded-[4px] bg-primary-500" aria-hidden="true">
        <Check className="size-3 text-white" strokeWidth={3} />
      </span>
    );
  }
  return <span className="relative size-4 shrink-0 rounded-[4px] bg-grey-300" aria-hidden="true" />;
}
