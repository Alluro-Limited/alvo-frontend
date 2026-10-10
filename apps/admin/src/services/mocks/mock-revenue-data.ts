import type {
  ChartPeriod,
  NodeRevenueRow,
  RevenueFlowPoint,
  RevenueLostBreakdown,
  RevenueMetrics,
  RevenuePeriod,
  RevenueTrendPoint,
  ServiceMixResponse,
} from "@/types/revenue-types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const NODE_NAMES = [
  "Lekki Hub",
  "VI Hub",
  "Ikeja Hub",
  "Yaba Hub",
  "Surulere Hub",
  "Ikoyi Hub",
  "Ajah Hub",
  "Maryland Hub",
  "Gbagada Hub",
  "Festac Hub",
  "Oshodi Hub",
  "Ikorodu Hub",
];

/** Deterministic stream — same input always yields the same 0–1 series. */
function stream(seed: string, length: number): number[] {
  let hash = 0;
  for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return Array.from({length}, (_, index) => {
    hash = (hash * 1_103_515_245 + 12_345) >>> 0;
    return ((hash >>> 8) % 10_000) / 10_000 + index * 0.001;
  });
}

/** Period scale — a year of volume spread across the window the pill describes. */
const PERIOD_SCALE: Record<RevenuePeriod, number> = {
  today: 0.004,
  week: 0.03,
  month: 0.16,
  year: 1,
  all: 1.9,
  custom: 0.5,
};

const BASE = {
  totalRevenue: 26_000_000,
  lost: 620_000,
  volume: 102_000,
  transactions: 14_950,
};

function bucketsFor(period: ChartPeriod): string[] {
  if (period === "1w") return DAYS;
  if (period === "6m") return MONTHS.slice(0, 6);
  return MONTHS;
}

/** The eight KPI cards — stream shares re-derive per period so pills visibly change the grid. */
export function metricsFor(period: RevenuePeriod): RevenueMetrics {
  const scale = PERIOD_SCALE[period];
  const [bulkShare, singleShare, partnerShare, netShare] = stream(`share:${period}`, 4).map((v, index) =>
    index === 0 ? 0.55 + v * 0.12 : index === 1 ? 0.2 + v * 0.1 : index === 2 ? 0.12 + v * 0.06 : 0.58 + v * 0.08
  );
  const totalRevenue = Math.round(BASE.totalRevenue * scale);
  return {
    totalRevenue,
    netRevenue: Math.round(totalRevenue * netShare),
    netPct: Math.round(netShare * 100),
    revenueLost: Math.round(BASE.lost * scale),
    packageVolume: Math.round(BASE.volume * scale),
    bulkRevenue: Math.round(totalRevenue * bulkShare),
    bulkPct: Math.round(bulkShare * 100),
    singleRevenue: Math.round(totalRevenue * singleShare),
    singlePct: Math.round(singleShare * 100),
    partnerFees: Math.round(totalRevenue * partnerShare),
    partnerPct: Math.round(partnerShare * 100),
    transactions: Math.round(BASE.transactions * scale),
  };
}

/** The Revenue Lost card — tiles split the metric's lost total across four causes. */
export function lostFor(period: RevenuePeriod, metrics: RevenueMetrics): RevenueLostBreakdown {
  const scale = Math.max(PERIOD_SCALE[period], 0.0001);
  const [a, b, c, d] = stream(`lost:${period}`, 4);
  const weights = [0.42 + a * 0.1, 0.24 + b * 0.08, 0.2 + c * 0.06, 0.1 + d * 0.04];
  const sum = weights[0] + weights[1] + weights[2] + weights[3];
  const item = (weight: number, countScale: number) => ({
    amount: Math.round((metrics.revenueLost * weight) / sum),
    count: Math.round(310 * scale * countScale),
  });
  return {
    total: metrics.revenueLost,
    pctOfGross: metrics.totalRevenue === 0 ? 0 : Math.round((metrics.revenueLost / metrics.totalRevenue) * 100),
    failedDeliveries: item(weights[0], 1),
    refunds: item(weights[1], 0.55),
    billingErrors: item(weights[2], 0.22),
    disputes: item(weights[3], 0.15),
  };
}

/** Stacked columns for the Revenue Trend bar chart. */
export function trendFor(period: ChartPeriod): RevenueTrendPoint[] {
  const labels = bucketsFor(period);
  const [bulk, single, partner, lost] = [0, 1, 2, 3].map((series) => stream(`trend:${period}:${series}`, labels.length));
  return labels.map((label, index) => ({
    label,
    bulk: Math.round(800_000 + bulk[index] * 1_600_000),
    single: Math.round(500_000 + single[index] * 1_900_000),
    partner: Math.round(180_000 + partner[index] * 520_000),
    lost: Math.round(30_000 + lost[index] * 160_000),
  }));
}

/** The area line chart — revenue mirrors the trend's bulk+single, volume rides along. */
export function flowFor(period: ChartPeriod): RevenueFlowPoint[] {
  const labels = bucketsFor(period);
  const [rev, vol] = [0, 1].map((series) => stream(`flow:${period}:${series}`, labels.length));
  return labels.map((label, index) => ({
    label,
    revenue: Math.round(1_200_000 + rev[index] * 2_400_000),
    volume: Math.round(600 + vol[index] * 1_800),
  }));
}

/** The service-type donut — three segments plus the parcel total in the center. */
export function serviceMixFor(period: ChartPeriod): ServiceMixResponse {
  const [a, b] = stream(`mix:${period}`, 2);
  const bulk = 0.52 + a * 0.14;
  const single = 0.2 + b * 0.1;
  const partner = Math.max(0.05, 1 - bulk - single);
  const scale = period === "1w" ? 0.06 : period === "6m" ? 0.5 : 1;
  const amount = (share: number) => Math.round(19_700_000 * share * scale);
  return {
    total: Math.round(12_600 * scale),
    segments: [
      {key: "bulk", amount: amount(bulk), pct: Math.round(bulk * 100)},
      {key: "single", amount: amount(single), pct: Math.round(single * 100)},
      {key: "partner", amount: amount(partner), pct: Math.round(partner * 100)},
    ],
  };
}

/** The 118-node ranking pool — revenue decays steeply like a real leaderboard, tail of inactive nodes. */
export function nodeRowsFor(): NodeRevenueRow[] {
  const revenue = stream("node:revenue", 118);
  const uptime = stream("node:uptime", 118);
  return Array.from({length: 118}, (_, index) => {
    const inactive = index >= 60;
    const rev = inactive ? 0 : Math.round(1_450_000 * Math.pow(0.84, index) + revenue[index] * 60_000);
    const parcels = inactive ? 0 : Math.round(rev / 2_000 + revenue[index] * 40);
    return {
      rank: index + 1,
      nodeId: `ND-${String(200 + index).padStart(3, "0")}`,
      node: NODE_NAMES[index % NODE_NAMES.length],
      revenue: Math.max(0, rev),
      pctOfTotal: 0,
      parcels,
      uptime: inactive ? 0 : Math.min(99.4, 99.4 - uptime[index] * 4.5 - index * 0.01),
    };
  });
}
