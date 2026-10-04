import {useMutation, useQueryClient} from "@tanstack/react-query";
import {authService} from "@/services/auth-service";

/** Activation turns the invited session into a full one, so everything cached before it is dropped. */
export function useCompleteAccountSetupMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.completeAccountSetup,
    onSuccess: () => queryClient.invalidateQueries(),
  });
}
