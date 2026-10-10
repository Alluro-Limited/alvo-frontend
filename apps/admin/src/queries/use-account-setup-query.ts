import {useQuery} from "@tanstack/react-query";
import {authService} from "@/services/auth-service";

export const accountSetupQueryKey = ["auth", "account-setup"] as const;

/** The invitation details (who invited the admin, which role) shown on the account-setup screen. */
export function useAccountSetupQuery() {
  return useQuery({queryKey: accountSetupQueryKey, queryFn: authService.getAccountSetup, retry: false});
}
