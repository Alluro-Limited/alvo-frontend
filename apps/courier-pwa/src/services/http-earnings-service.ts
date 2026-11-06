import {dayLabel, formatShortStamp} from "@/lib/datetime";
import {koboToNaira} from "@/lib/money";
import {apiClient} from "@/services/api-client";
import type {ApiEarningRow, ApiGetEarningsResponse} from "@/types/api-types";
import type {EarningTxn, EarningsService, TransactionGroup} from "@/types/earnings-types";

const toTxn = (row: ApiEarningRow): EarningTxn => ({
  id: row.jobId,
  kind: "delivery",
  title: row.jobId,
  subtitle: "Delivery",
  amount: koboToNaira(row.earningsKobo),
  timestamp: formatShortStamp(row.createdAt),
});

const rows = () => apiClient.get("v1/courier/earnings").json<ApiGetEarningsResponse>();

/**
 * Earnings against `v1/courier/earnings` — the wire returns a running total plus per-job
 * rows. Withdrawals, monthly subtotals, and the wallet concept don't exist courier-side;
 * month figures are computed client-side from the row timestamps.
 */
export const httpEarningsService: EarningsService = {
  getEarnings: async () => {
    const res = await rows();
    const month = new Date();
    const thisMonth = res.rows.filter((r) => {
      const d = new Date(r.createdAt);
      return d.getFullYear() === month.getFullYear() && d.getMonth() === month.getMonth();
    });
    return {
      walletBalance: koboToNaira(res.totalKobo),
      monthEarnings: thisMonth.reduce((sum, r) => sum + koboToNaira(r.earningsKobo), 0),
      monthJobs: thisMonth.length,
      recent: res.rows.slice(0, 5).map(toTxn),
    };
  },
  getHistory: async () => {
    const res = await rows();
    const groups: TransactionGroup[] = [];
    for (const row of res.rows) {
      const label = dayLabel(row.createdAt);
      const last = groups[groups.length - 1];
      if (last?.dayLabel === label) last.items.push(toTxn(row));
      else groups.push({dayLabel: label, items: [toTxn(row)]});
    }
    return groups;
  },
};
