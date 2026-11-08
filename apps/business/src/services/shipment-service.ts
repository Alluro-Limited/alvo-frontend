import type {ShipmentService} from "@/types/shipment-types";
import {httpShipmentService} from "./http-shipment-service";

/** Shipment against the real API. */
export const shipmentService: ShipmentService = httpShipmentService;
