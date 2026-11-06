import {formatDateTime} from "@/lib/datetime";
import {koboToNaira} from "@/lib/money";
import {apiClient} from "@/services/api-client";
import type {ApiGetSmeWalletResponse, ApiListSmeTransactionsResponse, ApiSmeTransaction} from "@/types/api-types";
import type {WalletService, WalletTransaction} from "@/types/wallet-types";

const toTxn = (t: ApiSmeTransaction): WalletTransaction => {
  const topup = !t.kind.includes("BATCH") && !t.kind.includes("PAYMENT");
  return {
    id: t.id,
    kind: topup ? "topup" : "batch_payment",
    batchId: t.batchId,
    amount: koboToNaira(t.amountKobo),
    date: formatDateTime(t.createdAt),
  };
};

/**
 * Wallet against `v1/sme/wallet` + `v1/sme/wallet/transactions`. There is no SME
 * virtual-account or checkout/top-up endpoint — `generateAccount` and `topUp` throw
 * until the API grows them.
 */
export const httpWalletService: WalletService = {
  getOverview: async () => {
    const [walletRes, txns] = await Promise.all([
      apiClient.get("v1/sme/wallet").json<ApiGetSmeWalletResponse>(),
      apiClient
        .get("v1/sme/wallet/transactions", {searchParams: {limit: 50}})
        .json<ApiListSmeTransactionsResponse>()
        .catch(() => null),
    ]);
    const transactions = (txns?.transactions ?? []).map(toTxn);
    return {
      balance: koboToNaira(walletRes.wallet.balanceKobo),
      lastTopUpDate: transactions.find((t) => t.kind === "topup")?.date ?? null,
      bankAccount: null,
      transactions,
    };
  },
  generateAccount: async () => {
    throw new Error("virtual accounts are not supported by the API yet");
  },
  topUp: async () => {
    throw new Error("wallet top-ups are not supported by the API yet");
  },
};
