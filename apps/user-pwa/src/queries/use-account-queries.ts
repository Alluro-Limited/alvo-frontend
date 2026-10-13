import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {accountService} from "@/services/account-service";
import type {AddressCandidate} from "@/types/account-types";

export const accountKeys = {
  data: ["account"] as const,
  addresses: ["account", "addresses"] as const,
  wallet: ["account", "wallet"] as const,
};

export function useAccountQuery() {
  return useQuery({queryKey: accountKeys.data, queryFn: () => accountService.getAccount()});
}

export function useAddressesQuery() {
  return useQuery({queryKey: accountKeys.addresses, queryFn: () => accountService.getAddresses()});
}

export function useWalletQuery() {
  return useQuery({queryKey: accountKeys.wallet, queryFn: () => accountService.getWallet()});
}

/** Creates the funding account; the wallet refetches so the card swaps to the account details. */
export function useGenerateVirtualAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => accountService.generateVirtualAccount(),
    onSuccess: () => queryClient.invalidateQueries({queryKey: accountKeys.wallet}),
  });
}

/** Saves the name; on success the account refetches so the row shows the new value. */
export function useUpdateName() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({firstName, lastName}: {firstName: string; lastName: string}) => accountService.updateName(firstName, lastName),
    onSuccess: () => queryClient.invalidateQueries({queryKey: accountKeys.data}),
  });
}

/** Sends the SMS code for a new phone number; `phone_in_use` rejections surface on the form. */
export function useSendPhoneVerification() {
  return useMutation({mutationFn: (phone: string) => accountService.sendPhoneVerification(phone)});
}

/** Verifies the SMS code; on success the account refetches with the new number. */
export function useVerifyPhone() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => accountService.verifyPhone(code),
    onSuccess: () => queryClient.invalidateQueries({queryKey: accountKeys.data}),
  });
}

/** Saves a node picked in the Address sheet; the list refetches so the new row appears. */
export function useAddAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (node: AddressCandidate) => accountService.addAddress(node),
    onSuccess: () => queryClient.invalidateQueries({queryKey: accountKeys.addresses}),
  });
}

export function useRemoveAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => accountService.removeAddress(id),
    onSuccess: () => queryClient.invalidateQueries({queryKey: accountKeys.addresses}),
  });
}

/** Delete step 1 — `invalid_password` rejections surface under the password field. */
export function useRequestAccountDeletion() {
  // react-doctor-disable-next-line react-doctor/query-mutation-missing-invalidation -- sending the code changes no cached data
  return useMutation({mutationFn: (password: string) => accountService.requestAccountDeletion(password)});
}

export function useResendDeletionCode() {
  // react-doctor-disable-next-line react-doctor/query-mutation-missing-invalidation -- resending the code changes no cached data
  return useMutation({mutationFn: () => accountService.resendDeletionCode()});
}

/** Delete step 2 — `invalid_code` rejections surface on the OTP boxes; success drops the stale profile. */
export function useConfirmAccountDeletion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => accountService.confirmAccountDeletion(code),
    onSuccess: () => queryClient.removeQueries({queryKey: accountKeys.data}),
  });
}
