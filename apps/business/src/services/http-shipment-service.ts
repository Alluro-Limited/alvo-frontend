import {apiClient} from "@/services/api-client";
import type {CreateBatchResult, Locker, ShipmentService} from "@/types/shipment-types";

/** Shipment creation over the real backend. Endpoint paths are placeholders until the API exists. */
export const httpShipmentService: ShipmentService = {
  getLockers: async () => apiClient.get("lockers").json<Locker[]>(),
  createBatch: async (input) => apiClient.post("shipments/batches", {json: input}).json<CreateBatchResult>(),
};
