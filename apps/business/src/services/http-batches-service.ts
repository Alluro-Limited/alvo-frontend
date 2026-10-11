import {apiClient} from "@/services/api-client";
import type {BatchDetail, BatchListResult, BatchesService, ShipmentTracking} from "@/types/batch-types";

/** Batches over the real backend. Endpoint paths are placeholders until the API exists. */
export const httpBatchesService: BatchesService = {
  getBatches: async () => apiClient.get("batches").json<BatchListResult>(),
  getBatch: async (id) => apiClient.get(`batches/${id}`).json<BatchDetail>(),
  getShipmentTracking: async (shipmentId) => apiClient.get(`shipments/${shipmentId}/tracking`).json<ShipmentTracking>(),
  deleteBatch: async (id) => apiClient.delete(`batches/${id}`).then(() => undefined),
};
