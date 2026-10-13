import {useMutation, useQueryClient} from "@tanstack/react-query";
import {authService} from "@/services/auth-service";

export const authKeys = {
  all: ["auth"] as const,
};

/** Step 1: sends the SMS code to the courier's phone number. */
export function useRequestLoginOtpMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (phone: string) => authService.requestLoginOtp(phone),
    onSuccess: () => queryClient.invalidateQueries({queryKey: authKeys.all}),
  });
}

/** "Resend code" on the verification screen — same request as step 1, different endpoint. */
export function useResendLoginOtpMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (phone: string) => authService.resendLoginOtp(phone),
    onSuccess: () => queryClient.invalidateQueries({queryKey: authKeys.all}),
  });
}

/** Step 2: verifies the 5-digit code; on success the courier session exists. */
export function useVerifyLoginOtpMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({phone, code}: {phone: string; code: string}) => authService.verifyLoginOtp(phone, code),
    onSuccess: () => queryClient.invalidateQueries({queryKey: authKeys.all}),
  });
}
