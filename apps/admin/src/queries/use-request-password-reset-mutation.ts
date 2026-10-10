import {useMutation} from "@tanstack/react-query";
import {authService} from "@/services/auth-service";

/** Sends a recovery link. Nothing is cached for signed-out users, so there is nothing to invalidate. */
export function useRequestPasswordResetMutation() {
  // eslint-disable-next-line react-doctor/query-mutation-missing-invalidation
  return useMutation({mutationFn: authService.requestPasswordReset});
}
