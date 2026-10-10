import type {Page} from "./workloads-types";

/** Whole-page period pills on the Overview tab — refetches the summary, charts, and breakdown. */
export type RevenuePeriod = "today" | "week" | "month" | "year" | "all" | "custom";

/** Per-card granularity pills on the trend/flow/service charts. */
export type ChartPeriod = "1w" | "6m" | "1y" | "custom";

/** Naira amounts across the console — the backend reports kobo-safe integers. */
export interface RevenueMetrics {
  totalRevenue: number;
  netRevenue: number;
  /** Net as a whole percent of total, e.g. 62. */
  netPct: number;
  revenueLost: number;
  packageVolume: number;
  bulkRevenue: number;
  bulkPct: number;
  singleRevenue: number;
  singlePct: number;
  partnerFees: number;
  partnerPct: number;
  transactions: number;
}

/** One colored tile in the Revenue Lost breakdown card. */
export interface RevenueLostItem {
  amount: number;
  count: number;
}

export interface RevenueLostBreakdown {
  total: number;
  /** Whole percent of gross revenue, e.g. 3. */
  pctOfGross: number;
  failedDeliveries: RevenueLostItem;
  refunds: RevenueLostItem;
  billingErrors: RevenueLostItem;
  disputes: RevenueLostItem;
}

/** The Overview tab's KPI grid plus the Revenue Lost card — one request. */
export interface RevenueOverviewResponse {
  metrics: RevenueMetrics;
  lost: RevenueLostBreakdown;
}

/** One stacked column in the Revenue Trend bar chart — month/week/day label plus per-stream naira. */
export interface RevenueTrendPoint {
  label: string;
  bulk: number;
  single: number;
  partner: number;
  lost: number;
}

export interface RevenueTrendResponse {
  points: RevenueTrendPoint[];
}

/** One point on the Revenue Trend area chart — naira line over parcel volume. */
export interface RevenueFlowPoint {
  label: string;
  revenue: number;
  volume: number;
}

export interface RevenueFlowResponse {
  points: RevenueFlowPoint[];
}

export type ServiceMixKey = "bulk" | "single" | "partner";

export interface ServiceMixSegment {
  key: ServiceMixKey;
  amount: number;
  /** Whole percent of the donut total. */
  pct: number;
}

export interface ServiceMixResponse {
  total: number;
  segments: ServiceMixSegment[];
}

/** One row of the Revenue by Node ranking table. */
export interface NodeRevenueRow {
  rank: number;
  nodeId: string;
  node: string;
  revenue: number;
  pctOfTotal: number;
  parcels: number;
  /** Percent with one decimal, e.g. 98.2 — colors follow the 96/95 thresholds in the design. */
  uptime: number;
}

export interface NodeRevenueMetrics {
  totalRevenue: number;
  activeNodes: number;
  /** Nil card when no node has processed revenue yet. */
  topNode: {name: string; revenue: number; parcels: number} | null;
  avgRevenue: number;
  avgParcels: number;
  avgUptime: number;
  /** Nodes under the 96% uptime threshold — the "3 nodes below 96%" subtext. */
  belowUptime: number;
}

export interface NodeRevenueResponse {
  metrics: NodeRevenueMetrics;
  nodes: Page<NodeRevenueRow>;
  /** The "Total from 10 nodes · 3,089 parcels · ₦6.15M" footer aggregate. */
  totals: {nodes: number; parcels: number; revenue: number};
}

export interface RevenueService {
  getRevenueOverview: (params: {period: RevenuePeriod}) => Promise<RevenueOverviewResponse>;
  /** Stacked monthly/weekly columns behind the Revenue Trend bar chart. */
  getRevenueTrend: (params: {period: ChartPeriod}) => Promise<RevenueTrendResponse>;
  /** The area line chart — revenue plus parcel volume per bucket. */
  getRevenueFlow: (params: {period: ChartPeriod}) => Promise<RevenueFlowResponse>;
  /** The Revenue by Service Type donut. */
  getServiceMix: (params: {period: ChartPeriod}) => Promise<ServiceMixResponse>;
  /** The Revenue by Node tab — ranked rows, paginated. */
  getNodeRevenue: (params: {page: number}) => Promise<NodeRevenueResponse>;
}
