import type {NodeRevenueResponse, NodeRevenueRow, RevenueService} from "@/types/revenue-types";
import {flowFor, lostFor, metricsFor, nodeRowsFor, serviceMixFor, trendFor} from "./mock-revenue-data";
import {mockDelay} from "./mock-http";

const PAGE_SIZE = 10;
const ROWS = nodeRowsFor();

/** Rank + %-of-total are global aggregates — computed once over the whole pool. */
const TOTAL_REVENUE = ROWS.reduce((sum, row) => sum + row.revenue, 0);
const RANKED: NodeRevenueRow[] = ROWS.map((row) => ({
  ...row,
  pctOfTotal: TOTAL_REVENUE === 0 ? 0 : Math.round((row.revenue / TOTAL_REVENUE) * 100),
}))
  .sort((a, b) => b.revenue - a.revenue || a.rank - b.rank)
  .map((row, index) => ({...row, rank: index + 1}));

function nodePage(page: number): NodeRevenueResponse {
  const start = (page - 1) * PAGE_SIZE;
  const active = RANKED.filter((row) => row.parcels > 0);
  const top = active[0];
  const avg = (sum: number) => Math.round(sum / Math.max(active.length, 1));
  return {
    metrics: {
      totalRevenue: TOTAL_REVENUE,
      activeNodes: active.length,
      topNode: top ? {name: top.node, revenue: top.revenue, parcels: top.parcels} : null,
      avgRevenue: avg(active.reduce((sum, row) => sum + row.revenue, 0)),
      avgParcels: avg(active.reduce((sum, row) => sum + row.parcels, 0)),
      avgUptime: active.length === 0 ? 0 : Math.round((active.reduce((sum, row) => sum + row.uptime, 0) / active.length) * 10) / 10,
      belowUptime: active.filter((row) => row.uptime < 96).length,
    },
    nodes: {items: RANKED.slice(start, start + PAGE_SIZE), page, pageSize: PAGE_SIZE, total: RANKED.length},
    totals: {
      nodes: RANKED.length,
      parcels: RANKED.reduce((sum, row) => sum + row.parcels, 0),
      revenue: TOTAL_REVENUE,
    },
  };
}

/** In-memory stand-in for the revenue API while it does not exist. */
export const mockRevenueService: RevenueService = {
  getRevenueOverview: async ({period}) => {
    await mockDelay();
    const metrics = metricsFor(period);
    return {metrics, lost: lostFor(period, metrics)};
  },
  getRevenueTrend: async ({period}) => {
    await mockDelay();
    return {points: trendFor(period)};
  },
  getRevenueFlow: async ({period}) => {
    await mockDelay();
    return {points: flowFor(period)};
  },
  getServiceMix: async ({period}) => {
    await mockDelay();
    return serviceMixFor(period);
  },
  getNodeRevenue: async ({page}) => {
    await mockDelay();
    return nodePage(page);
  },
};
