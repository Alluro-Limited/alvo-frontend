import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {sendService} from "@/services/send-service";
import type {BookingRequest, QuoteInput} from "@/types/send-types";

export const sendKeys = {
  nodes: ["send", "nodes"] as const,
  quote: (input: QuoteInput) => ["send", "quote", input] as const,
};

export function useSendNodesQuery() {
  return useQuery({queryKey: sendKeys.nodes, queryFn: () => sendService.getNodes()});
}

/** Re-prices whenever size/fragile/speed change; only fetched once a size is picked. */
export function useSendQuoteQuery(input: QuoteInput | null) {
  return useQuery({
    queryKey: sendKeys.quote(input ?? {size: "small", fragile: false, speed: "standard"}),
    queryFn: () => sendService.getQuote(input as QuoteInput),
    enabled: input !== null,
  });
}

export function useSendBookingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: BookingRequest) => sendService.createBooking(request),
    // A booking consumes a locker slot, so node availability is stale afterwards.
    onSuccess: () => queryClient.invalidateQueries({queryKey: sendKeys.nodes}),
  });
}
