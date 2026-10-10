import * as v from "valibot";
import {apiClient} from "@/services/api-client";
import type {RevenueService} from "@/types/revenue-types";

const MetricsSchema = v.object({
  totalRevenue: v.number(),
  netRevenue: v.number(),
  netPct: v.number(),
  revenueLost: v.number(),
  packageVolume: v.number(),
  bulkRevenue: v.number(),
  bulkPct: v.number(),
  singleRevenue: v.number(),
  singlePct: v.number(),
  partnerFees: v.number(),
  partnerPct: v.number(),
  transactions: v.number(),
});

const LostItemSchema = v.object({amount: v.number(), count: v.number()});

const OverviewSchema = v.object({
  metrics: MetricsSchema,
  lost: v.object({
    total: v.number(),
    pctOfGross: v.number(),
    failedDeliveries: LostItemSchema,
    refunds: LostItemSchema,
    billingErrors: LostItemSchema,
    disputes: LostItemSchema,
  }),
});

const TrendSchema = v.object({
  points: v.array(v.object({label: v.string(), bulk: v.number(), single: v.number(), partner: v.number(), lost: v.number()})),
});

const FlowSchema = v.object({points: v.array(v.object({label: v.string(), revenue: v.number(), volume: v.number()}))});

const MixSchema = v.object({
  total: v.number(),
  segments: v.array(v.object({key: v.picklist(["bulk", "single", "partner"]), amount: v.number(), pct: v.number()})),
});

const NodeRowSchema = v.object({
  rank: v.number(),
  nodeId: v.string(),
  node: v.string(),
  revenue: v.number(),
  pctOfTotal: v.number(),
  parcels: v.number(),
  uptime: v.number(),
});

const NodeRevenueSchema = v.object({
  metrics: v.object({
    totalRevenue: v.number(),
    activeNodes: v.number(),
    topNode: v.nullable(v.object({name: v.string(), revenue: v.number(), parcels: v.number()})),
    avgRevenue: v.number(),
    avgParcels: v.number(),
    avgUptime: v.number(),
    belowUptime: v.number(),
  }),
  nodes: v.object({items: v.array(NodeRowSchema), page: v.number(), pageSize: v.number(), total: v.number()}),
  totals: v.object({nodes: v.number(), parcels: v.number(), revenue: v.number()}),
});

/** Valibot-schemad HTTP contract — the shapes the real API must return. */
export const httpRevenueService: RevenueService = {
  getRevenueOverview: async ({period}) => {
    const body = await apiClient.get("revenue/overview", {searchParams: {period}}).json();
    return v.parse(OverviewSchema, body);
  },
  getRevenueTrend: async ({period}) => {
    const body = await apiClient.get("revenue/trend", {searchParams: {period}}).json();
    return v.parse(TrendSchema, body);
  },
  getRevenueFlow: async ({period}) => {
    const body = await apiClient.get("revenue/flow", {searchParams: {period}}).json();
    return v.parse(FlowSchema, body);
  },
  getServiceMix: async ({period}) => {
    const body = await apiClient.get("revenue/service-mix", {searchParams: {period}}).json();
    return v.parse(MixSchema, body);
  },
  getNodeRevenue: async ({page}) => {
    const body = await apiClient.get("revenue/nodes", {searchParams: {page}}).json();
    return v.parse(NodeRevenueSchema, body);
  },
};
