import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {safeService} from "@/services/safe-service";
import type {SafeQuoteInput, SafeReserveRequest} from "@/types/safe-types";

export const safeKeys = {
  nodes: ["safe", "nodes"] as const,
  options: ["safe", "options"] as const,
  quote: (input: SafeQuoteInput) => ["safe", "quote", input] as const,
};

export function useSafeNodesQuery() {
  return useQuery({queryKey: safeKeys.nodes, queryFn: () => safeService.getNodes()});
}

export function useSafeOptionsQuery() {
  return useQuery({queryKey: safeKeys.options, queryFn: () => safeService.getOptions()});
}

/** Re-prices whenever size/duration change; only fetched once both are picked. */
export function useSafeQuoteQuery(input: SafeQuoteInput | null) {
  return useQuery({
    queryKey: safeKeys.quote(input ?? {size: "small", durationId: ""}),
    queryFn: () => safeService.getQuote(input as SafeQuoteInput),
    enabled: input !== null,
  });
}

export function useSafeReserveMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: SafeReserveRequest) => safeService.reserve(request),
    // A reservation consumes a safe, so node availability is stale afterwards.
    onSuccess: () => queryClient.invalidateQueries({queryKey: safeKeys.nodes}),
  });
}
