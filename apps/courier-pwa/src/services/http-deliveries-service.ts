import {apiClient} from "@/services/api-client";
import type {
  CourierNotification,
  DeliveriesOverview,
  DeliveriesService,
  DeliveryAnalytics,
  NotificationsService,
} from "@/types/deliveries-types";

/** The Deliveries tab + Analytics over the real backend. Endpoint paths are placeholders until the API exists. */
export const httpDeliveriesService: DeliveriesService = {
  getDeliveries: async () => apiClient.get("courier/deliveries").json<DeliveriesOverview>(),
  getAnalytics: async () => apiClient.get("courier/deliveries/analytics").json<DeliveryAnalytics>(),
};

/** The notifications feed over the real backend. Endpoint paths are placeholders until the API exists. */
export const httpNotificationsService: NotificationsService = {
  getNotifications: async () => apiClient.get("courier/notifications").json<CourierNotification[]>(),
};
