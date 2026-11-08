import type {NotificationsService} from "@/types/deliveries-types";
import {httpNotificationsService} from "./http-deliveries-service";

/** Courier notifications feed against the real API. */
export const notificationsService: NotificationsService = httpNotificationsService;
