import {useMutation, useQueryClient} from "@tanstack/react-query";
import {authService} from "@/services/auth-service";

/** A new session invalidates everything cached under the previous one. */
export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.signIn,
    onSuccess: () => queryClient.invalidateQueries(),
  });
}

/** Signing out ends the session and drops every cached query. */
export function useSignOutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.signOut,
    onSuccess: () => queryClient.clear(),
  });
}
