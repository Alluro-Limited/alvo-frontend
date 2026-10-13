import {apiClient} from "./api-client";
import type {BookingRequest, LockerNode, SendBooking, SendQuote, SendService} from "@/types/send-types";

/** HTTP implementation for the Send Securely flow: node lookup, price quote, and booking. */
export const httpSendService: SendService = {
  getNodes: () => apiClient.get("lockers/nodes").json<LockerNode[]>(),
  getQuote: (input) => apiClient.post("deliveries/quote", {json: input}).json<SendQuote>(),
  createBooking: (request: BookingRequest) => apiClient.post("deliveries", {json: request}).json<SendBooking>(),
};
