import {useMutation, useQueryClient} from "@tanstack/react-query";
import {authService} from "@/services/auth-service";

/** A new session invalidates everything cached under the previous one. */
export function useSignInMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.signIn,
    onSuccess: () => queryClient.invalidateQueries(),
  });
}
