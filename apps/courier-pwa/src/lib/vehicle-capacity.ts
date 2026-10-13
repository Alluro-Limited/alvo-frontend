import bicycleIcon from "@/assets/vehicle-bicycle.svg";
import carIcon from "@/assets/vehicle-car.svg";
import motorcycleIcon from "@/assets/vehicle-motorcycle.svg";
import vanIcon from "@/assets/vehicle-van.svg";
import type {VehicleType} from "@/types/earnings-types";

export interface VehicleCapacity {
  icon: string;
  /** i18n key suffix under `veh.*` for the name and description. */
  key: VehicleType;
  maxPackages: number;
  maxWeightKg: number;
}

/** Display capacities per vehicle type from the design; the backend will own these values later. */
export const VEHICLE_CAPACITY: Record<VehicleType, VehicleCapacity> = {
  bicycle: {icon: bicycleIcon, key: "bicycle", maxPackages: 10, maxWeightKg: 15},
  motorcycle: {icon: motorcycleIcon, key: "motorcycle", maxPackages: 20, maxWeightKg: 30},
  car: {icon: carIcon, key: "car", maxPackages: 60, maxWeightKg: 150},
  van: {icon: vanIcon, key: "van", maxPackages: 10, maxWeightKg: 15},
};

export const VEHICLE_TYPES: VehicleType[] = ["bicycle", "motorcycle", "car", "van"];
