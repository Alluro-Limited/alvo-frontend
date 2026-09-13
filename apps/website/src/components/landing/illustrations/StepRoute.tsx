import {MapPin, Navigation} from "lucide-react";

export function StepRoute() {
  return (
    <div className="w-full rounded-2xl bg-white p-5 shadow-lg">
      <h4 className="text-lg font-semibold text-black">Courier assigned</h4>

      <div className="mt-4 flex items-center gap-3 rounded-xl bg-grey-100 p-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white">
          <Navigation className="size-4" />
        </span>
        <span className="flex flex-1 flex-col">
          <span className="text-sm font-medium text-black">On the way · by code #4821</span>
          <span className="text-xs text-grey-600">Matched to a route already heading your way</span>
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm">
        <MapPin className="size-4 shrink-0 text-primary-500" />
        <span className="font-medium text-black">Oshodi</span>
        <span className="h-0.5 flex-1 rounded-full bg-primary-500" />
        <span className="font-medium text-black">Ajah</span>
        <MapPin className="size-4 shrink-0 text-primary-500" />
      </div>

      <p className="mt-3 text-xs text-grey-600">Couriers route by locker and code, never by customer.</p>
    </div>
  );
}
