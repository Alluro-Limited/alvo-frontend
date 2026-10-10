import {useMutation, useQueryClient} from "@tanstack/react-query";
import {payoutsService} from "@/services/payouts-service";
import type {FlagPayoutInput, MarkPaidInput, WithholdPayoutInput} from "@/types/payouts-types";

/** Marks one or more payouts paid — the single dialog passes one id, the batch flow every selected id. */
export function useMarkPaidMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: MarkPaidInput) => payoutsService.markPayoutsPaid(input),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["payouts"]}),
  });
}

/** Holds a courier's payout behind an unresolved package issue. */
export function useWithholdPayoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({courierId, input}: {courierId: string; input: WithholdPayoutInput}) => payoutsService.withholdPayout(courierId, input),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["payouts"]}),
  });
}

/** Flags a settled payout for review — lands in the Flagged Payments card. */
export function useFlagPayoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({courierId, input}: {courierId: string; input: FlagPayoutInput}) => payoutsService.flagPayout(courierId, input),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["payouts"]}),
  });
}
