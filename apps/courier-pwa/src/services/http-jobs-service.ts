import {apiClient} from "@/services/api-client";
import type {DeliveryDetail, DeliveryService, DeliveryStatus, JobOffer, JobsService} from "@/types/delivery-types";

/** Jobs marketplace over the real backend. Endpoint paths are placeholders until the API exists. */
export const httpJobsService: JobsService = {
  getJobs: async () => apiClient.get("courier/jobs").json<JobOffer[]>(),
  acceptJob: async (jobId) => {
    await apiClient.post(`courier/jobs/${jobId}/accept`);
  },
  declineJob: async (jobId) => {
    await apiClient.post(`courier/jobs/${jobId}/decline`);
  },
};

/** The delivery detail over the real backend. Endpoint paths are placeholders until the API exists. */
export const httpDeliveryService: DeliveryService = {
  getDelivery: async (jobId) => apiClient.get(`courier/deliveries/${jobId}`).json<DeliveryDetail>(),
  scanNextPackage: async (jobId) => apiClient.post(`courier/deliveries/${jobId}/scan`).json<DeliveryDetail>(),
  scanPackage: async (jobId, code) => apiClient.post(`courier/deliveries/${jobId}/scan`, {json: {code}}).json<DeliveryDetail>(),
  updateStatus: async (jobId, status: DeliveryStatus) =>
    apiClient.post(`courier/deliveries/${jobId}/status`, {json: {status}}).json<DeliveryDetail>(),
};
