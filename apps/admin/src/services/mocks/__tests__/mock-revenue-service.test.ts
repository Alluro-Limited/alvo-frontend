import {describe, expect, it, vi} from "vite-plus/test";
import {mockRevenueService} from "../mock-revenue-service";

vi.mock("../mock-http", async (importOriginal) => {
  const original = await importOriginal<typeof import("../mock-http")>();
  return {...original, mockDelay: () => Promise.resolve()};
});

describe("mockRevenueService", () => {
  describe("getRevenueOverview", () => {
    it("returns deterministic metrics plus the lost breakdown", async () => {
      const a = await mockRevenueService.getRevenueOverview({period: "year"});
      const b = await mockRevenueService.getRevenueOverview({period: "year"});
      expect(a).toEqual(b);
      expect(a.metrics.totalRevenue).toBeGreaterThan(0);
      expect(a.metrics.bulkPct + a.metrics.singlePct + a.metrics.partnerPct).toBeLessThanOrEqual(100);
      expect(a.lost.total).toBe(a.metrics.revenueLost);
      expect(a.lost.failedDeliveries.amount + a.lost.refunds.amount + a.lost.billingErrors.amount + a.lost.disputes.amount).toBeGreaterThan(
        0
      );
    });

    it("scales amounts by the requested period", async () => {
      const today = await mockRevenueService.getRevenueOverview({period: "today"});
      const year = await mockRevenueService.getRevenueOverview({period: "year"});
      expect(today.metrics.totalRevenue).toBeLessThan(year.metrics.totalRevenue);
      expect(today.metrics.packageVolume).toBeLessThan(year.metrics.packageVolume);
    });
  });

  describe("getRevenueTrend", () => {
    it("buckets weekly, half-year and yearly windows differently", async () => {
      expect((await mockRevenueService.getRevenueTrend({period: "1w"})).points).toHaveLength(7);
      expect((await mockRevenueService.getRevenueTrend({period: "6m"})).points).toHaveLength(6);
      expect((await mockRevenueService.getRevenueTrend({period: "1y"})).points).toHaveLength(12);
      const points = (await mockRevenueService.getRevenueTrend({period: "1y"})).points;
      expect(points.every((point) => point.bulk > 0 && point.single > 0 && point.lost >= 0)).toBe(true);
    });
  });

  describe("getRevenueFlow", () => {
    it("returns revenue plus parcel volume per bucket", async () => {
      const {points} = await mockRevenueService.getRevenueFlow({period: "6m"});
      expect(points).toHaveLength(6);
      expect(points.every((point) => point.revenue > 0 && point.volume > 0)).toBe(true);
    });
  });

  describe("getServiceMix", () => {
    it("returns the three service segments totaling roughly 100%", async () => {
      const mix = await mockRevenueService.getServiceMix({period: "1y"});
      expect(mix.segments.map((segment) => segment.key).sort()).toEqual(["bulk", "partner", "single"]);
      const pct = mix.segments.reduce((sum, segment) => sum + segment.pct, 0);
      expect(pct).toBeGreaterThanOrEqual(98);
      expect(pct).toBeLessThanOrEqual(102);
      expect(mix.total).toBeGreaterThan(0);
    });
  });

  describe("getNodeRevenue", () => {
    it("returns ranked pages of ten with consistent totals", async () => {
      const page1 = await mockRevenueService.getNodeRevenue({page: 1});
      const page2 = await mockRevenueService.getNodeRevenue({page: 2});
      expect(page1.nodes.items).toHaveLength(10);
      expect(page1.nodes.items[0].rank).toBe(1);
      expect(page1.nodes.items[0].revenue).toBeGreaterThanOrEqual(page1.nodes.items[9].revenue);
      expect(page2.nodes.items[0].rank).toBe(11);
      expect(page1.nodes.items.map((row) => row.nodeId)).not.toEqual(page2.nodes.items.map((row) => row.nodeId));
      expect(page1.totals.nodes).toBe(page1.nodes.total);
      expect(page1.metrics.topNode?.name).toBe(page1.nodes.items[0].node);
      expect(page1.metrics.activeNodes).toBeGreaterThan(0);
    });
  });
});
