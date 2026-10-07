import type {VehicleType} from "@/types/couriers-types";
import courierBike from "@/assets/courier-bike.svg";
import courierCar from "@/assets/courier-car.svg";
import courierMoto from "@/assets/courier-moto.svg";
import courierVan from "@/assets/courier-van.svg";
import {VEHICLE_LABELS} from "./courier-labels";

const ICONS: Record<VehicleType, string> = {
  bicycle: courierBike,
  car: courierCar,
  motorcycle: courierMoto,
  van: courierVan,
};

/** The Vehicle Type cell — the circular Figma vehicle glyph next to the category label. */
export function CourierVehicleCell({vehicle}: {vehicle: VehicleType}) {
  return (
    <span className="flex items-center gap-2">
      <img src={ICONS[vehicle]} alt="" className="size-8" aria-hidden="true" />
      {VEHICLE_LABELS[vehicle]()}
    </span>
  );
}
