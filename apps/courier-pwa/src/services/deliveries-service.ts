import type {DeliveriesService} from "@/types/deliveries-types";
import {httpDeliveriesService} from "./http-deliveries-service";
import {mockDeliveriesService} from "./mocks/mock-deliveries-service";

/** No backend yet: without `VITE_API_URL`, the deliveries overview is served by the local mock. */
export const deliveriesService: DeliveriesService = import.meta.env.VITE_API_URL ? httpDeliveriesService : mockDeliveriesService;
