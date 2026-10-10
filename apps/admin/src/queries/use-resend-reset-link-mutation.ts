import {useMutation} from "@tanstack/react-query";
import {authService} from "@/services/auth-service";

/** Swaps an expired recovery link for a fresh one; the result is shown once, never cached. */
export function useResendResetLinkMutation() {
  // eslint-disable-next-line react-doctor/query-mutation-missing-invalidation
  return useMutation({mutationFn: authService.resendResetLink});
}
