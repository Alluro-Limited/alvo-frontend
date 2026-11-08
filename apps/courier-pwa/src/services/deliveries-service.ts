import type {DeliveriesService} from "@/types/deliveries-types";
import {httpDeliveriesService} from "./http-deliveries-service";

/** Apps/Courier Pwa/Src/Services/Deliveries Service service against the real API. */
export const deliveriesService: DeliveriesService = httpDeliveriesService;
