import {apiClient} from "./api-client";
import type {SafeNode, SafeOptions, SafeQuote, SafeQuoteInput, SafeReserveRequest, SafeReservation, SafeService} from "@/types/safe-types";

/** HTTP implementation for the Safe Storage flow: node lookup, size/duration options, quote, and reservation. */
export const httpSafeService: SafeService = {
  getNodes: () => apiClient.get("safes/nodes").json<SafeNode[]>(),
  getOptions: () => apiClient.get("safes/options").json<SafeOptions>(),
  getQuote: (input: SafeQuoteInput) => apiClient.post("safes/quote", {json: input}).json<SafeQuote>(),
  reserve: (request: SafeReserveRequest) => apiClient.post("safes", {json: request}).json<SafeReservation>(),
};
