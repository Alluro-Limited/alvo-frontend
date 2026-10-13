import {httpNotificationService} from "./http-notification-service";
import {mockNotificationService} from "./mocks/mock-notification-service";
import type {UserNotificationService} from "@/types/notification-types";

/** No backend yet: without `VITE_API_URL`, notifications come from the local mock. */
export const notificationService: UserNotificationService = import.meta.env.VITE_API_URL
  ? httpNotificationService
  : mockNotificationService;
