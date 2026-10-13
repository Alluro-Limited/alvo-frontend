import type {EarningsOverview, EarningsService, EarningTxn, TransactionGroup} from "@/types/earnings-types";
import {mockDelay} from "./mock-http";

const TIMESTAMP = "09/03/26 | 09:55 AM";

/** Mirrors the Figma feed: one withdrawal then delivery credits, grouped by day. */
const RECENT: EarningTxn[] = [
  {id: "t1", kind: "withdrawal", title: "Auto-Withdrawal", subtitle: "Access Bank ····4821", amount: -23200, timestamp: TIMESTAMP},
  {id: "t2", kind: "delivery", title: "PRI-4728123780", subtitle: "Regular", amount: 3200, timestamp: TIMESTAMP},
  {id: "t3", kind: "delivery", title: "PRI-4728123781", subtitle: "Speed Delivery", amount: 3200, timestamp: TIMESTAMP},
  {id: "t4", kind: "delivery", title: "PRI-4728123782", subtitle: "Regular", amount: 3200, timestamp: TIMESTAMP},
];

const HISTORY: TransactionGroup[] = [
  {dayLabel: null, items: RECENT.slice(0, 3)},
  {
    dayLabel: "Yesterday",
    items: [{id: "t5", kind: "delivery", title: "PRI-4728123790", subtitle: "Regular", amount: 5600, timestamp: TIMESTAMP}],
  },
  {
    dayLabel: "16/12/2025",
    items: [
      {id: "t6", kind: "delivery", title: "PRI-4728123795", subtitle: "Regular", amount: 2600, timestamp: TIMESTAMP},
      {id: "t7", kind: "withdrawal", title: "Auto-Withdrawal", subtitle: "Access Bank ····4821", amount: -3200, timestamp: TIMESTAMP},
    ],
  },
  {
    dayLabel: "17/12/2025",
    items: [
      {id: "t8", kind: "delivery", title: "PRI-4728123801", subtitle: "Speed Delivery", amount: 5600, timestamp: TIMESTAMP},
      {id: "t9", kind: "delivery", title: "PRI-4728123802", subtitle: "Regular", amount: 3200, timestamp: TIMESTAMP},
    ],
  },
];

/** In-memory stand-in for the earnings backend while it does not exist. */
export const mockEarningsService: EarningsService = {
  getEarnings: async (): Promise<EarningsOverview> => {
    await mockDelay(400);
    return {walletBalance: 48500, monthEarnings: 32800, monthJobs: 12, recent: [...RECENT]};
  },
  getHistory: async () => {
    await mockDelay(400);
    return HISTORY.map((group) => ({...group, items: [...group.items]}));
  },
};
