import {screen} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {earningsService} from "@/services/earnings-service";
import {renderRoute} from "@/test/render-route";
import type {EarningTxn, TransactionGroup} from "@/types/earnings-types";
import {EarningsPage} from "../earnings";
import {EarningsHistoryPage} from "../earnings-history";

vi.mock("@/services/earnings-service", () => ({
  earningsService: {getEarnings: vi.fn(), getHistory: vi.fn()},
}));

const getEarnings = vi.mocked(earningsService.getEarnings);
const getHistory = vi.mocked(earningsService.getHistory);

const TXN: EarningTxn = {
  id: "t1",
  kind: "delivery",
  title: "PRI-4728123780",
  subtitle: "Regular",
  amount: 3200,
  timestamp: "09/03/26 | 09:55 AM",
};
const PAYOUT: EarningTxn = {
  id: "t2",
  kind: "withdrawal",
  title: "Auto-Withdrawal",
  subtitle: "Access Bank ····4821",
  amount: -23200,
  timestamp: "09/03/26 | 09:55 AM",
};

describe("EarningsPage", () => {
  beforeEach(() => {
    getEarnings.mockReset().mockResolvedValue({walletBalance: 48500, monthEarnings: 32800, monthJobs: 12, recent: [PAYOUT, TXN]});
  });

  it("shows the wallet card, month tiles, banner, and recent activity", async () => {
    renderRoute(EarningsPage, "/earnings");
    expect(await screen.findByText("₦48,500")).toBeTruthy();
    expect(screen.getByText("₦32,800")).toBeTruthy();
    expect(screen.getByText("12 analytics.jobs")).toBeTruthy();
    expect(screen.getByText("earnings.wallet")).toBeTruthy();
    expect(screen.getByText("earnings.info_days")).toBeTruthy();
    expect(screen.getByText("earnings.history")).toBeTruthy();
    expect(screen.getByRole("link", {name: "job.see_all"})).toBeTruthy();
    expect(screen.getByText("+₦3,200")).toBeTruthy();
    expect(screen.getByText("-₦23,200")).toBeTruthy();
  });

  it("shows the empty state when there is no activity", async () => {
    getEarnings.mockResolvedValue({walletBalance: 0, monthEarnings: 0, monthJobs: 0, recent: []});
    renderRoute(EarningsPage, "/earnings");
    expect(await screen.findByText("earnings.none")).toBeTruthy();
  });
});

describe("EarningsHistoryPage", () => {
  it("renders day groups with dividers", async () => {
    const groups: TransactionGroup[] = [
      {dayLabel: null, items: [PAYOUT, TXN]},
      {dayLabel: "Yesterday", items: [{...TXN, id: "t3", title: "PRI-4728123790"}]},
    ];
    getHistory.mockReset().mockResolvedValue(groups);
    renderRoute(EarningsHistoryPage, "/earnings/history");
    expect(await screen.findByText("Auto-Withdrawal")).toBeTruthy();
    expect(screen.getByText("earnings.history_title")).toBeTruthy();
    expect(screen.getByText("Yesterday")).toBeTruthy();
    expect(screen.getByText("PRI-4728123790")).toBeTruthy();
  });
});
