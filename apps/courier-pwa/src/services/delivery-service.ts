import type {DeliveryService} from "@/types/delivery-types";
import {httpDeliveryService} from "./http-delivery-service";

/** Apps/Courier Pwa/Src/Services/Delivery Service service against the real API. */
export const deliveryService: DeliveryService = httpDeliveryService;
