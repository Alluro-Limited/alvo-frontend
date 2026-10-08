import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {revenueService} from "@/services/revenue-service";
import {renderRoute} from "@/test/render-route";
import type {NodeRevenueResponse, RevenueOverviewResponse, ServiceMixResponse} from "@/types/revenue-types";
import {RevenuePage} from "../revenue";

vi.mock("@/services/revenue-service", () => ({
  revenueService: {
    getRevenueOverview: vi.fn(),
    getRevenueTrend: vi.fn(),
    getRevenueFlow: vi.fn(),
    getServiceMix: vi.fn(),
    getNodeRevenue: vi.fn(),
  },
}));

const getRevenueOverview = vi.mocked(revenueService.getRevenueOverview);
const getRevenueTrend = vi.mocked(revenueService.getRevenueTrend);
const getRevenueFlow = vi.mocked(revenueService.getRevenueFlow);
const getServiceMix = vi.mocked(revenueService.getServiceMix);
const getNodeRevenue = vi.mocked(revenueService.getNodeRevenue);

const OVERVIEW: RevenueOverviewResponse = {
  metrics: {
    totalRevenue: 4_150_000,
    netRevenue: 2_560_000,
    netPct: 62,
    revenueLost: 955_000,
    packageVolume: 16_425,
    bulkRevenue: 2_490_000,
    bulkPct: 60,
    singleRevenue: 996_000,
    singlePct: 24,
    partnerFees: 664_000,
    partnerPct: 16,
    transactions: 2_392,
  },
  lost: {
    total: 955_000,
    pctOfGross: 23,
    failedDeliveries: {amount: 400_000, count: 124},
    refunds: {amount: 250_000, count: 68},
    billingErrors: {amount: 180_000, count: 27},
    disputes: {amount: 125_000, count: 19},
  },
};

const TREND = {
  points: [
    {label: "Jan", bulk: 1_000_000, single: 500_000, partner: 200_000, lost: 50_000},
    {label: "Feb", bulk: 1_200_000, single: 600_000, partner: 220_000, lost: 60_000},
  ],
};

const FLOW = {
  points: [
    {label: "Jan", revenue: 2_000_000, volume: 800},
    {label: "Feb", revenue: 2_400_000, volume: 950},
  ],
};

const MIX: ServiceMixResponse = {
  total: 12_600,
  segments: [
    {key: "bulk", amount: 11_820_000, pct: 60},
    {key: "single", amount: 4_728_000, pct: 24},
    {key: "partner", amount: 3_152_000, pct: 16},
  ],
};

const NODE_ROW = {rank: 1, nodeId: "ND-200", node: "Lekki Hub", revenue: 1_420_000, pctOfTotal: 23, parcels: 712, uptime: 98.2};

const NODES: NodeRevenueResponse = {
  metrics: {
    totalRevenue: 6_150_000,
    activeNodes: 10,
    topNode: {name: "Lekki Hub", revenue: 1_420_000, parcels: 712},
    avgRevenue: 615_000,
    avgParcels: 309,
    avgUptime: 96.1,
    belowUptime: 3,
  },
  nodes: {
    items: [NODE_ROW, {...NODE_ROW, rank: 2, nodeId: "ND-201", node: "VI Hub", revenue: 980_000, uptime: 95.1}],
    page: 1,
    pageSize: 10,
    total: 20,
  },
  totals: {nodes: 20, parcels: 3_089, revenue: 6_150_000},
};

const EMPTY_NODES: NodeRevenueResponse = {
  metrics: {totalRevenue: 0, activeNodes: 0, topNode: null, avgRevenue: 0, avgParcels: 0, avgUptime: 0, belowUptime: 0},
  nodes: {items: [], page: 1, pageSize: 10, total: 0},
  totals: {nodes: 0, parcels: 0, revenue: 0},
};

beforeEach(() => {
  vi.clearAllMocks();
  getRevenueOverview.mockResolvedValue(OVERVIEW);
  getRevenueTrend.mockResolvedValue(TREND);
  getRevenueFlow.mockResolvedValue(FLOW);
  getServiceMix.mockResolvedValue(MIX);
  getNodeRevenue.mockResolvedValue(NODES);
});

describe("RevenuePage", () => {
  it("renders the KPI grid, charts, donut, and lost breakdown", async () => {
    renderRoute(RevenuePage, "/revenue");
    expect(await screen.findByTestId("kpi-grid")).toBeTruthy();
    expect(screen.getByText("revenue.kpi_total")).toBeTruthy();
    expect(screen.getByText("4.15M")).toBeTruthy();
    expect(screen.getByText("16,425")).toBeTruthy();
    expect(screen.getAllByTestId("trend-segment-bulk")).toHaveLength(2);
    expect(screen.getByTestId("service-mix-total").textContent).toContain("12,600");
    expect(screen.getByTestId("mix-legend-partner").textContent).toContain("revenue.legend_partner - 16%");
    expect(screen.getByTestId("flow-line")).toBeTruthy();
    expect(screen.getByTestId("lost-tile-failedDeliveries").textContent).toContain("revenue.lost_failed");
  });

  it("refetches the overview when a page-level period pill is clicked", async () => {
    renderRoute(RevenuePage, "/revenue");
    await screen.findByTestId("kpi-grid");
    fireEvent.click(screen.getByRole("tab", {name: "revenue.period_month"}));
    await waitFor(() => expect(getRevenueOverview).toHaveBeenCalledWith({period: "month"}));
  });

  it("refetches the trend chart on its own period pills", async () => {
    renderRoute(RevenuePage, "/revenue");
    await screen.findByTestId("kpi-grid");
    fireEvent.click(screen.getAllByRole("tab", {name: "revenue.chart_1w"})[0]);
    await waitFor(() => expect(getRevenueTrend).toHaveBeenCalledWith({period: "1w"}));
  });

  it("shows the hover tooltip over a trend column", async () => {
    renderRoute(RevenuePage, "/revenue");
    await screen.findByTestId("kpi-grid");
    fireEvent.mouseEnter(screen.getByTestId("trend-bar-Jan"));
    expect(screen.getByRole("tooltip").textContent).toContain("revenue.legend_bulk:");
    expect(screen.getAllByTestId("trend-crosshair").filter((el) => !el.classList.contains("hidden"))).toHaveLength(1);
  });

  it("switches to the Revenue by Node tab with the ranked table", async () => {
    renderRoute(RevenuePage, "/revenue");
    await screen.findByTestId("kpi-grid");
    fireEvent.click(screen.getByRole("tab", {name: "revenue.tab_nodes"}));
    expect(await screen.findByTestId("node-kpi-grid")).toBeTruthy();
    expect(screen.getAllByTestId("node-row")).toHaveLength(2);
    expect(screen.getByTestId("nodes-totals").textContent).toContain("revenue.nodes_summary");
    expect(screen.getByTestId("nodes-totals").textContent).toContain("revenue.parcels_summary");
    expect(screen.getByTestId("nodes-totals").textContent).toContain("₦6.15M");
    expect(getNodeRevenue).toHaveBeenCalledWith({page: 1});
  });

  it("paginates the node table", async () => {
    renderRoute(RevenuePage, "/revenue");
    await screen.findByTestId("kpi-grid");
    fireEvent.click(screen.getByRole("tab", {name: "revenue.tab_nodes"}));
    await screen.findByTestId("node-kpi-grid");
    fireEvent.click(screen.getByRole("button", {name: "revenue.page_next"}));
    await waitFor(() => expect(getNodeRevenue).toHaveBeenCalledWith({page: 2}));
  });

  it("shows the node empty state when no node revenue exists", async () => {
    getNodeRevenue.mockResolvedValue(EMPTY_NODES);
    renderRoute(RevenuePage, "/revenue");
    await screen.findByTestId("kpi-grid");
    fireEvent.click(screen.getByRole("tab", {name: "revenue.tab_nodes"}));
    expect(await screen.findByTestId("nodes-empty")).toBeTruthy();
  });

  it("shows an error card and retries the failed request", async () => {
    getRevenueOverview.mockRejectedValueOnce(new Error("boom"));
    renderRoute(RevenuePage, "/revenue");
    expect(await screen.findAllByTestId("revenue-error")).not.toHaveLength(0);
    fireEvent.click(screen.getAllByRole("button", {name: "revenue.retry"})[0]);
    await waitFor(() => expect(getRevenueOverview).toHaveBeenCalledTimes(2));
  });
});
