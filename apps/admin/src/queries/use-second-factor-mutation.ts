import {useMutation, useQueryClient} from "@tanstack/react-query";
import {authService} from "@/services/auth-service";

/** Completing the challenge issues a session, so everything cached before it is dropped. */
export function useSecondFactorMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.verifySecondFactor,
    onSuccess: () => queryClient.invalidateQueries(),
  });
}
