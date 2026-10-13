import {apiClient} from "./api-client";
import type {ActivityItem, ActivityService, DeliveryDetail, ExtendPreview, ExtendResult} from "@/types/activity-types";

/** HTTP implementation for the Activities feed and the delivery detail/tracking payloads. */
export const httpActivityService: ActivityService = {
  getActivities: () => apiClient.get("users/activities").json<ActivityItem[]>(),
  getDelivery: (id: string) => apiClient.get(`deliveries/${id}`).json<DeliveryDetail>(),
  previewDropoffExtension: (id: string, hours: number) =>
    apiClient.post(`deliveries/${id}/extend/preview`, {json: {hours}}).json<ExtendPreview>(),
  extendDropoff: (id: string, hours: number) => apiClient.post(`deliveries/${id}/extend`, {json: {hours}}).json<ExtendResult>(),
  previewPickupExtension: (id: string, hours: number) =>
    apiClient.post(`deliveries/${id}/pickup/extend/preview`, {json: {hours}}).json<ExtendPreview>(),
  reactivatePickup: (id: string, hours: number, channel: "wallet" | "online") =>
    apiClient.post(`deliveries/${id}/pickup/reactivate`, {json: {hours, channel}}).json<ExtendResult>(),
  upgradeLocker: async (id: string, channel: "wallet" | "online") => {
    await apiClient.post(`deliveries/${id}/upgrade`, {json: {channel}});
  },
  cancelShipment: async (id: string) => {
    await apiClient.post(`deliveries/${id}/cancel`);
  },
  sendPickupVerification: async (id: string) => {
    await apiClient.post(`deliveries/${id}/pickup/verify/send`);
  },
  verifyPickup: async (id: string, code: string) => {
    await apiClient.post(`deliveries/${id}/pickup/verify`, {json: {code}});
  },
};
