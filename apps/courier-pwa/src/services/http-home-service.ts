import {apiClient} from "@/services/api-client";
import type {CourierHome, CourierHomeService, DeliveryArea} from "@/types/home-types";

/** Courier home over the real backend. Endpoint paths are placeholders until the API exists. */
export const httpHomeService: CourierHomeService = {
  getHome: async () => apiClient.get("courier/home").json<CourierHome>(),
  setAvailability: async (live) => {
    await apiClient.patch("courier/availability", {json: {live}});
  },
  acceptJob: async (jobId) => {
    await apiClient.post(`courier/jobs/${jobId}/accept`);
  },
  declineJob: async (jobId) => {
    await apiClient.post(`courier/jobs/${jobId}/decline`);
  },
  getAreas: async () => apiClient.get("courier/delivery-areas").json<DeliveryArea[]>(),
  setDeliveryArea: async (areaId) => {
    await apiClient.patch("courier/delivery-area", {json: {areaId}});
  },
};
