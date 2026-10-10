import type {BatchDetail, BatchRow, ParcelRow, ParcelRoute, WorkloadFilterOptions, WorkloadMetrics} from "@/types/workloads-types";

/** Metrics behind the Batches tab strip — mirrors the populated frame's keys. */
export const BATCH_LIST_METRICS: WorkloadMetrics = {
  active: 9,
  slaBreaches: 2,
  queued: 4,
  pendingPickup: 12,
  expiredParcel: 1,
  flagged: 0,
};

export const BATCH_FILTER_OPTIONS: WorkloadFilterOptions = {
  statuses: ["active", "completed", "queued", "stalled", "flagged"],
  locations: [
    {id: "ikeja", label: "Ikeja"},
    {id: "lekki", label: "Lekki"},
    {id: "ikoyi", label: "Ikoyi"},
    {id: "yaba", label: "Yaba"},
  ],
};

/** Filter options for the parcel table inside a batch — parcel statuses, not batch tags. */
export const BATCH_PARCEL_FILTER_OPTIONS: WorkloadFilterOptions = {
  statuses: ["pending_pickup", "in_transit", "delivered", "failed", "expired"],
  locations: [
    {id: "LK-022", label: "Ikeja (LK-022)"},
    {id: "LK-015", label: "Lekki (LK-015)"},
    {id: "VI-007", label: "Victoria Island (VI-007)"},
  ],
};

const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * 3_600_000).toISOString();

/** Rows behind the Batches card list — mirrors the populated Figma frame. */
export const BATCH_ROWS: BatchRow[] = [
  {
    id: "BTC-2301",
    tags: ["active"],
    sme: "Kuda Bank",
    createdAt: hoursAgo(7),
    city: "Ikeja",
    totalValue: 336000,
    parcelCount: 840,
    delivered: 170,
    breakdown: [
      {key: "delivered", count: 170},
      {key: "in_transit", count: 56},
      {key: "delayed", count: 170},
    ],
  },
  {
    id: "BTC-2298",
    tags: ["active", "flagged"],
    sme: "Moniepoint",
    createdAt: hoursAgo(26),
    city: "Lekki",
    totalValue: 198400,
    parcelCount: 512,
    delivered: 88,
    breakdown: [
      {key: "delivered", count: 88},
      {key: "in_transit", count: 214},
      {key: "delayed", count: 12},
    ],
  },
  {
    id: "BTC-2294",
    tags: ["stalled"],
    sme: "OPay",
    createdAt: hoursAgo(52),
    city: "Yaba",
    totalValue: 84500,
    parcelCount: 300,
    delivered: 260,
    breakdown: [
      {key: "delivered", count: 260},
      {key: "in_transit", count: 6},
      {key: "delayed", count: 4},
    ],
  },
  {
    id: "BTC-2291",
    tags: ["queued"],
    sme: "Kuda Bank",
    createdAt: hoursAgo(80),
    city: "Ikoyi",
    totalValue: 412900,
    parcelCount: 1050,
    delivered: 0,
    breakdown: [
      {key: "delivered", count: 0},
      {key: "in_transit", count: 0},
      {key: "delayed", count: 0},
    ],
  },
  {
    id: "BTC-2286",
    tags: ["completed"],
    sme: "FairMoney",
    createdAt: hoursAgo(120),
    city: "Ikeja",
    totalValue: 502750,
    parcelCount: 764,
    delivered: 764,
    breakdown: [
      {key: "delivered", count: 764},
      {key: "in_transit", count: 0},
      {key: "delayed", count: 0},
    ],
  },
];

/** The total the footer reports — the mock pretends there are more batches than the fixture covers. */
export const MOCK_BATCH_TOTAL = 43;
export const MOCK_BATCH_PAGE_SIZE = 5;

const RECIPIENTS = [
  "Dayo Ogunsanya",
  "Hauwa Zubairu",
  "Miebi Obubra",
  "Chisom Agu",
  "Kemi Oladipo",
  "Umar Usman",
  "Seiye Amakiri",
  "Ekiye Opuene",
  "Adaeze Nwosu",
  "Tobi Falana",
  "Emeka Anyaoku",
  "Hauwa Kabiru",
] as const;

const PARCEL_STATUSES: ParcelRow["status"][] = [
  "pending_pickup",
  "delivered",
  "pending_pickup",
  "in_transit",
  "failed",
  "pending_pickup",
  "delivered",
  "delivered",
  "delivered",
  "in_transit",
  "delivered",
  "pending_pickup",
];

/** Parcel rows inside a batch — batch listings show Recipient and Last Node. */
export const BATCH_PARCEL_ROWS: ParcelRow[] = RECIPIENTS.map((recipient, index) => ({
  id: `PRV-883${String(1 + index).padStart(2, "0")}`,
  sender: "Kuda Bank",
  recipient,
  destination: index % 3 === 2 ? "Lekki, Lagos (LK-015)" : "Ikeja, Lagos (Ik-022)",
  courierId: index % 4 === 0 ? "PRG-041" : "PRG-023",
  destinationNodeId: index % 3 === 2 ? "LK-015" : "LK-022",
  lastNodeId: index % 3 === 2 ? "LK-015" : "LK-022",
  status: PARCEL_STATUSES[index],
  slaRemainingMin: PARCEL_STATUSES[index] === "pending_pickup" && index === 5 ? null : 56 + index * 8,
  flagged: false,
}));

/** Per-batch metric strip on the detail view — the showcase batch mirrors the Figma numbers. */
export const BATCH_DETAIL_METRICS: WorkloadMetrics = {
  total: 840,
  delivered: 720,
  inTransit: 56,
  expiredParcel: 2,
  slaBreaches: 3,
  pendingPickup: 4,
  flagged: 6,
};

const BATCH_ROUTE_STEPS: ParcelRoute[] = [
  {
    label: "1st Route Timeline",
    steps: [
      {key: "created", actor: "Via mobile app", at: "2026-03-16T08:02:00"},
      {key: "dropped_at_node", actor: "LK-022", at: "2026-03-16T09:15:00"},
      {key: "picked_up", actor: "PRG-023", at: "2026-03-16T10:40:00"},
      {key: "delivered"},
      {key: "collected"},
    ],
  },
  {
    label: "2nd Route Timeline",
    steps: [
      {key: "created", actor: "Via mobile app", at: "2026-03-16T08:02:00"},
      {key: "dropped_at_node", actor: "LK-022", at: "2026-03-16T09:15:00"},
      {key: "picked_up", actor: "PRG-023", at: "2026-03-16T10:40:00"},
      {key: "delivered"},
      {key: "collected"},
    ],
  },
];

export function batchDetailFor(id: string): BatchDetail | undefined {
  const batch = BATCH_ROWS.find((row) => row.id === id);
  if (!batch) return undefined;
  return {
    id: batch.id,
    tags: batch.tags,
    sme: batch.sme,
    createdAt: batch.createdAt,
    city: batch.city,
    totalValue: batch.totalValue,
    parcelCount: batch.parcelCount,
    delivered: batch.delivered,
    metrics: BATCH_DETAIL_METRICS,
    filters: BATCH_PARCEL_FILTER_OPTIONS,
  };
}

/** Batch parcels travel two legs — the drawer shows both route timelines. */
export const BATCH_PARCEL_ROUTES = BATCH_ROUTE_STEPS;
