import {apiClient} from "./api-client";
import type {NotificationGroup, UserNotificationService} from "@/types/notification-types";

/** HTTP implementation for the notifications feed. */
export const httpNotificationService: UserNotificationService = {
  getNotifications: () => apiClient.get("users/notifications").json<NotificationGroup[]>(),
};
