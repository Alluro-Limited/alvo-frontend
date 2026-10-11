import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {walletService} from "@/services/wallet-service";
import type {TopupMethod} from "@/types/wallet-types";
import {dashboardKeys} from "./use-dashboard-queries";

export const walletKeys = {
  all: ["wallet"] as const,
  overview: () => [...walletKeys.all, "overview"] as const,
};

export function useWalletOverview() {
  return useQuery({queryKey: walletKeys.overview(), queryFn: walletService.getOverview});
}

/** Invalidate the wallet and the dashboard/header balance after money moves. */
function useInvalidateWallet() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({queryKey: walletKeys.all});
    void queryClient.invalidateQueries({queryKey: dashboardKeys.overview});
  };
}

export function useGenerateAccountMutation() {
  const invalidate = useInvalidateWallet();
  return useMutation({mutationFn: walletService.generateAccount, onSuccess: invalidate});
}

export function useTopUpMutation() {
  const invalidate = useInvalidateWallet();
  return useMutation({
    mutationFn: ({amount, method}: {amount: number; method: TopupMethod}) => walletService.topUp(amount, method),
    onSuccess: invalidate,
  });
}
