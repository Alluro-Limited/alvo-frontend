import {apiClient} from "@/services/api-client";
import type {EarningsOverview, EarningsService, TransactionGroup} from "@/types/earnings-types";

/** The Earnings tab + Transaction History over the real backend. Endpoint paths are placeholders until the API exists. */
export const httpEarningsService: EarningsService = {
  getEarnings: () => apiClient.get("courier/earnings").json<EarningsOverview>(),
  getHistory: () => apiClient.get("courier/earnings/history").json<TransactionGroup[]>(),
};
