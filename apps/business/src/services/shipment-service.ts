import type {ShipmentService} from "@/types/shipment-types";
import {httpShipmentService} from "./http-shipment-service";
import {mockShipmentService} from "./mocks/mock-shipment-service";

/**
 * Picks the shipment service: the mock while `VITE_API_URL` is unset, HTTP otherwise.
 * Wallet payment debits the demo session balance; `402` means insufficient funds.
 */
export const shipmentService: ShipmentService = import.meta.env.VITE_API_URL ? httpShipmentService : mockShipmentService;
