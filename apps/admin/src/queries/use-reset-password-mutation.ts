import {useMutation, useQueryClient} from "@tanstack/react-query";
import {authService} from "@/services/auth-service";

/** A reset signs out every session, so anything cached under the old one is dropped. */
export function useResetPasswordMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => queryClient.invalidateQueries(),
  });
}
