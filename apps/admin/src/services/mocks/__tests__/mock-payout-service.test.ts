import {describe, expect, it, vi} from "vite-plus/test";
import {mockPayoutsService} from "../mock-payout-service";

vi.mock("../mock-http", async (importOriginal) => {
  const original = await importOriginal<typeof import("../mock-http")>();
  return {...original, mockDelay: () => Promise.resolve()};
});

const CYCLE = "2026-06B";

describe("mockPayoutsService", () => {
  describe("getPayouts", () => {
    it("returns a deterministic metrics + table + issue-card payload", async () => {
      const a = await mockPayoutsService.getPayouts({cycle: CYCLE, page: 1});
      const b = await mockPayoutsService.getPayouts({cycle: CYCLE, page: 1});
      expect(a).toEqual(b);
      expect(a.cycles.length).toBeGreaterThan(1);
      expect(a.filters.statuses).toContain("withheld");
      expect(a.payouts.items.length).toBeGreaterThan(0);
      expect(a.metrics.totalPayout).toBeGreaterThan(0);
      expect(a.payouts.total).toBeGreaterThan(a.payouts.pageSize);
    });

    it("keeps KPI math consistent with the row data", async () => {
      const {metrics, payouts} = await mockPayoutsService.getPayouts({cycle: CYCLE, page: 1});
      expect(metrics.paidAmount + metrics.notPaidAmount + metrics.withheldAmount).toBeLessThanOrEqual(metrics.totalPayout);
      expect(metrics.paidCouriers + metrics.awaitingTransfer + metrics.withheldCouriers).toBeLessThanOrEqual(metrics.courierCount);
      expect(payouts.items.every((row) => row.netPayout > 0 && row.accountNumber.length === 10)).toBe(true);
    });

    it("filters rows by status and by the search query", async () => {
      const withheld = await mockPayoutsService.getPayouts({cycle: CYCLE, page: 1, status: "withheld"});
      expect(withheld.payouts.items.every((row) => row.status === "withheld")).toBe(true);
      expect(withheld.payouts.total).toBeGreaterThan(0);
      const name = withheld.payouts.items[0].name;
      const searched = await mockPayoutsService.getPayouts({cycle: CYCLE, page: 1, query: name.slice(0, 5)});
      expect(searched.payouts.items.some((row) => row.name.includes(name.slice(0, 5)))).toBe(true);
    });

    it("paginates the table ten rows at a time", async () => {
      const page1 = await mockPayoutsService.getPayouts({cycle: CYCLE, page: 1});
      const page2 = await mockPayoutsService.getPayouts({cycle: CYCLE, page: 2});
      expect(page1.payouts.items).toHaveLength(10);
      expect(page2.payouts.items[0].courierId).not.toBe(page1.payouts.items[0].courierId);
    });
  });

  describe("getPayoutDetail + getPayoutDeliveries", () => {
    it("mirrors the row's bank and payout figures in the detail", async () => {
      const {payouts} = await mockPayoutsService.getPayouts({cycle: CYCLE, page: 1});
      const row = payouts.items[0];
      const detail = await mockPayoutsService.getPayoutDetail(row.courierId, CYCLE);
      expect(detail.courierId).toBe(row.courierId);
      expect(detail.netPayout).toBe(row.netPayout);
      expect(detail.bank.bankName).toBe(row.bankName);
      expect(detail.deliveriesCompleted).toBe(row.deliveries);
    });

    it("serves deterministic, filterable deliveries with a consistent earned total", async () => {
      const {payouts} = await mockPayoutsService.getPayouts({cycle: CYCLE, page: 1});
      const id = payouts.items[0].courierId;
      const a = await mockPayoutsService.getPayoutDeliveries(id, CYCLE, {page: 1});
      const b = await mockPayoutsService.getPayoutDeliveries(id, CYCLE, {page: 1});
      expect(a).toEqual(b);
      expect(a.totalEarned).toBeGreaterThan(0);
      const express = await mockPayoutsService.getPayoutDeliveries(id, CYCLE, {page: 1, type: "express"});
      expect(express.deliveries.items.every((row) => row.type === "express")).toBe(true);
    });
  });

  describe("mutations", () => {
    it("marks payouts paid and stamps the settlement date on the detail", async () => {
      const {payouts} = await mockPayoutsService.getPayouts({cycle: "2026-06A", page: 1});
      const target = payouts.items.find((row) => row.status !== "paid")!;
      await mockPayoutsService.markPayoutsPaid({
        cycle: "2026-06A",
        courierIds: [target.courierId],
        paymentMethod: "bank_transfer",
        paymentDate: "2026-06-25",
      });
      const after = await mockPayoutsService.getPayouts({cycle: "2026-06A", page: 1, query: target.courierId});
      expect(after.payouts.items[0].status).toBe("paid");
      const detail = await mockPayoutsService.getPayoutDetail(target.courierId, "2026-06A");
      expect(detail.paidAt).toBe("2026-06-25");
    });

    it("keeps mark-as-paid scoped to the submitted cycle", async () => {
      const {payouts} = await mockPayoutsService.getPayouts({cycle: "2026-06A", page: 1});
      const id = payouts.items[0].courierId;
      const before = await mockPayoutsService.getPayoutDetail(id, CYCLE);
      await mockPayoutsService.markPayoutsPaid({cycle: "2026-06A", courierIds: [id], paymentMethod: "manual", paymentDate: "2026-06-20"});
      const after = await mockPayoutsService.getPayoutDetail(id, CYCLE);
      expect(after.status).toBe(before.status);
    });

    it("withholds a payout and prepends an open dispute", async () => {
      const {payouts} = await mockPayoutsService.getPayouts({cycle: CYCLE, page: 1});
      const target = payouts.items.find((row) => row.status === "not_paid")!;
      await mockPayoutsService.withholdPayout(target.courierId, {
        cycle: CYCLE,
        parcelId: "PRC-7777",
        issueType: "damaged",
        amountAtRisk: 12_000,
        description: "Box arrived crushed.",
      });
      const detail = await mockPayoutsService.getPayoutDetail(target.courierId, CYCLE);
      expect(detail.status).toBe("withheld");
      expect(detail.disputes[0].parcelId).toBe("PRC-7777");
      expect(detail.disputes[0].status).toBe("open");
    });

    it("flags a payout and adds an investigating dispute", async () => {
      const {payouts} = await mockPayoutsService.getPayouts({cycle: CYCLE, page: 2});
      const target = payouts.items.find((row) => row.status !== "flagged")!;
      await mockPayoutsService.flagPayout(target.courierId, {cycle: CYCLE, disputeReason: "underpaid", details: "Short by ₦4,000"});
      const detail = await mockPayoutsService.getPayoutDetail(target.courierId, CYCLE);
      expect(detail.status).toBe("flagged");
      expect(detail.disputes[0].status).toBe("investigating");
    });
  });

  describe("exportPayouts", () => {
    it("exports every row as CSV and honors the id subset", async () => {
      const all = await mockPayoutsService.exportPayouts({cycle: CYCLE});
      expect(all.split("\n")[0]).toBe("courier_id,name,account_number,bank_name,deliveries,net_payout,status");
      const {payouts} = await mockPayoutsService.getPayouts({cycle: CYCLE, page: 1});
      const ids = payouts.items.slice(0, 2).map((row) => row.courierId);
      const subset = await mockPayoutsService.exportPayouts({cycle: CYCLE, ids});
      expect(subset.split("\n")).toHaveLength(1 + ids.length);
    });
  });
});
