import {useQuery} from "@tanstack/react-query";
import {authService} from "@/services/auth-service";

export const currentUserQueryKey = ["auth", "me"] as const;

/** The signed-in admin displayed in the shell's top navigation. */
export function useCurrentUserQuery() {
  return useQuery({queryKey: currentUserQueryKey, queryFn: authService.getCurrentUser, retry: false});
}
