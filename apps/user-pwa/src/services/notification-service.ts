import {httpNotificationService} from "./http-notification-service";
import type {UserNotificationService} from "@/types/notification-types";

/** User notifications against the real API. */
export const notificationService: UserNotificationService = httpNotificationService;
