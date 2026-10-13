import type {DeliveryService} from "@/types/delivery-types";
import {httpDeliveryService} from "./http-jobs-service";
import {mockDeliveryService} from "./mocks/mock-delivery-service";

/** No backend yet: without `VITE_API_URL`, the delivery detail is served by the local mock. */
export const deliveryService: DeliveryService = import.meta.env.VITE_API_URL ? httpDeliveryService : mockDeliveryService;
