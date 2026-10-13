import {useMutation, useQueryClient} from "@tanstack/react-query";
import {signupService} from "@/services/signup-service";

export const signupKeys = {
  all: ["signup"] as const,
  application: () => [...signupKeys.all, "application"] as const,
};

export function useSubmitApplicationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: signupService.submitApplication,
    onSuccess: () => void queryClient.invalidateQueries({queryKey: signupKeys.all}),
  });
}
