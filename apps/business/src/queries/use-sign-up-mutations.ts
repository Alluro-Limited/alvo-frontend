import {useMutation, useQueryClient} from "@tanstack/react-query";
import {authService} from "@/services/auth-service";

/** A new account invalidates everything cached under any previous session. */
export function useSignUpMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.signUp,
    onSuccess: () => queryClient.invalidateQueries(),
  });
}

/** A verified account is a new session, so the whole cache is stale. */
export function useVerifyEmailMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.verifyEmail,
    onSuccess: () => queryClient.invalidateQueries(),
  });
}

/** A resent code supersedes the pending one, so cached verification state is stale. */
export function useResendCodeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.resendVerificationCode,
    onSuccess: () => queryClient.invalidateQueries(),
  });
}
