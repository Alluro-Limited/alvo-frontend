import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {payoutsService} from "@/services/payouts-service";
import type {PayoutDeliveriesParams, PayoutListParams} from "@/types/payouts-types";

/** Metrics + issue cards + the filtered, paginated payout table. Previous page data stays while the next loads. */
export function usePayoutsQuery(params: PayoutListParams) {
  return useQuery({
    queryKey: ["payouts", "list", params] as const,
    queryFn: () => payoutsService.getPayouts(params),
    retry: false,
    placeholderData: keepPreviousData,
  });
}

/** The courier payout detail behind the side drawer. */
export function usePayoutDetailQuery(courierId: string | null, cycle: string) {
  return useQuery({
    queryKey: ["payouts", "detail", cycle, courierId] as const,
    queryFn: () => payoutsService.getPayoutDetail(courierId ?? "", cycle),
    enabled: courierId !== null,
    retry: false,
  });
}

/** Deliveries behind the View Deliveries modal — filtered and paginated. */
export function usePayoutDeliveriesQuery(courierId: string | null, cycle: string, params: PayoutDeliveriesParams) {
  return useQuery({
    queryKey: ["payouts", "deliveries", cycle, courierId, params] as const,
    queryFn: () => payoutsService.getPayoutDeliveries(courierId ?? "", cycle, params),
    enabled: courierId !== null,
    retry: false,
    placeholderData: keepPreviousData,
  });
}
