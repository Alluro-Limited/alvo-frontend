import type {NotificationsService} from "@/types/deliveries-types";
import {httpNotificationsService} from "./http-deliveries-service";
import {mockNotificationsService} from "./mocks/mock-notifications-service";

/** No backend yet: without `VITE_API_URL`, the notifications feed is served by the local mock. */
export const notificationsService: NotificationsService = import.meta.env.VITE_API_URL
  ? httpNotificationsService
  : mockNotificationsService;
