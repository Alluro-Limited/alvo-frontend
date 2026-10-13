import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {accountService} from "@/services/account-service";
import {earningsService} from "@/services/earnings-service";
import type {BankAccount, NotificationPrefKey, NotificationPrefs, VehicleType} from "@/types/earnings-types";

export const earningsKeys = {
  all: ["earnings"] as const,
  history: ["earnings", "history"] as const,
  profile: ["account", "profile"] as const,
  support: ["account", "support"] as const,
  bank: ["account", "bank"] as const,
  banks: ["account", "banks"] as const,
  notifPrefs: ["account", "notif-prefs"] as const,
};

export function useEarningsQuery() {
  return useQuery({queryKey: earningsKeys.all, queryFn: () => earningsService.getEarnings()});
}

export function useEarningsHistoryQuery() {
  return useQuery({queryKey: earningsKeys.history, queryFn: () => earningsService.getHistory()});
}

export function useProfileQuery() {
  return useQuery({queryKey: earningsKeys.profile, queryFn: () => accountService.getProfile()});
}

export function useSupportContactQuery() {
  return useQuery({queryKey: earningsKeys.support, queryFn: () => accountService.getSupportContact()});
}

export function useSignOutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => accountService.signOut(),
    onSuccess: () => queryClient.clear(),
  });
}

/** Deletion ends the session — drop every cached query on success. */
export function useDeleteAccountMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => accountService.deleteAccount(code),
    onSuccess: () => queryClient.clear(),
  });
}

export function useVehicleChangeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vehicle: VehicleType) => accountService.requestVehicleChange(vehicle),
    onSuccess: () => void queryClient.invalidateQueries({queryKey: earningsKeys.profile}),
  });
}

export function useBankAccountQuery() {
  return useQuery({queryKey: earningsKeys.bank, queryFn: () => accountService.getBankAccount()});
}

export function useBanksQuery() {
  return useQuery({queryKey: earningsKeys.banks, queryFn: () => accountService.getBanks()});
}

export function useBankChangeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (account: BankAccount) => accountService.requestBankChange(account),
    onSuccess: () => void queryClient.invalidateQueries({queryKey: earningsKeys.bank}),
  });
}

export function useNotificationPrefsQuery() {
  return useQuery({queryKey: earningsKeys.notifPrefs, queryFn: () => accountService.getNotificationPrefs()});
}

/** Flips one notification category — optimistic, rolls back on failure. */
export function useSetNotificationPrefMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({key, enabled}: {key: NotificationPrefKey; enabled: boolean}) => accountService.setNotificationPref(key, enabled),
    onMutate: async ({key, enabled}) => {
      await queryClient.cancelQueries({queryKey: earningsKeys.notifPrefs});
      const prev = queryClient.getQueryData<NotificationPrefs>(earningsKeys.notifPrefs);
      if (prev) queryClient.setQueryData(earningsKeys.notifPrefs, {...prev, [key]: enabled});
      return {prev};
    },
    onError: (_error, _vars, context) => {
      if (context?.prev) queryClient.setQueryData(earningsKeys.notifPrefs, context.prev);
    },
    onSettled: () => void queryClient.invalidateQueries({queryKey: earningsKeys.notifPrefs}),
  });
}
