import {apiClient} from "@/services/api-client";
import type {BankAccount, WalletOverview, WalletService, WalletTransaction} from "@/types/wallet-types";

/** Wallet over the real backend. Endpoint paths are placeholders until the API exists. */
export const httpWalletService: WalletService = {
  getOverview: async () => apiClient.get("wallet").json<WalletOverview>(),
  generateAccount: async () => apiClient.post("wallet/account").json<BankAccount>(),
  topUp: async (amount, method) => apiClient.post("wallet/topups", {json: {amount, method}}).json<WalletTransaction>(),
};
