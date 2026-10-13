import {Package, Weight} from "lucide-react";
import {VEHICLE_CAPACITY} from "@/lib/vehicle-capacity";
import {m} from "@/paraglide/messages";
import type {VehicleType} from "@/types/earnings-types";

interface CapacityCardProps {
  vehicle: VehicleType;
}

/** The grey vehicle card: icon + name + description, then the Packages / Max Weight tiles. */
export function CapacityCard({vehicle}: CapacityCardProps) {
  const capacity = VEHICLE_CAPACITY[vehicle];
  return (
    <section className="flex flex-col gap-4 rounded-[12px] bg-[#f9f9f9] p-3">
      <div className="flex items-center gap-2.5">
        <img src={capacity.icon} alt="" className="size-10" />
        <div>
          <p className="text-[14px] font-medium">{m[`veh.${capacity.key}`]()}</p>
          <p className="text-[12px] leading-[17px] text-primary-850/70">{m[`veh.desc_${capacity.key}`]()}</p>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="flex-1 rounded-[8px] bg-[#f2f2f2] p-2">
          <p className="flex items-center gap-1 text-[12px] font-medium text-primary-500">
            <Package className="size-4" aria-hidden="true" />
            {m["veh.packages"]()}
          </p>
          <p className="mt-1 text-[12px] text-grey-500">{m["veh.pkg_up_to"]({count: capacity.maxPackages})}</p>
        </div>
        <div className="flex-1 rounded-[8px] bg-[#f2f2f2] p-2">
          <p className="flex items-center gap-1 text-[12px] font-medium text-primary-500">
            <Weight className="size-4" aria-hidden="true" />
            {m["veh.weight"]()}
          </p>
          <p className="mt-1 text-[12px] text-grey-500">{m["veh.weight_max"]({kg: capacity.maxWeightKg})}</p>
        </div>
      </div>
    </section>
  );
}
