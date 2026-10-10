import {useMutation, useQueryClient} from "@tanstack/react-query";
import {authService} from "@/services/auth-service";

/** Signing out drops everything cached under the session. */
export function useSignOutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.signOut,
    onSettled: () => queryClient.clear(),
  });
}
