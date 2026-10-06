import type {
  SafeItemDetail,
  SafeItemRow,
  SafeItemStatus,
  SafeStepKey,
  SafeTimelineStep,
  WorkloadFilterOptions,
  WorkloadMetrics,
} from "@/types/workloads-types";

export const MOCK_SAFE_PAGE_SIZE = 10;

const OWNERS = [
  "Hauwa Zubairu",
  "Miebi Obubra",
  "Hauwa Kabiru",
  "Umar Usman",
  "Emeka Anyaoku",
  "Ekiye Opuene",
  "Chisom Agu",
  "Kemi Oladipo",
  "Seiye Amakiri",
  "Tobi Falana",
] as const;

const SAFE_STATUSES: SafeItemStatus[] = [
  "pending_pickup",
  "expiring_soon",
  "pending_pickup",
  "expired",
  "active",
  "active",
  "active",
  "expired",
  "retrieved",
  "pending_pickup",
  "active",
  "expiring_soon",
  "retrieved",
  "active",
  "expired",
  "active",
  "retrieved",
  "active",
  "expiring_soon",
  "active",
  "expired",
  "pending_pickup",
  "retrieved",
  "active",
];

const ITEMS = ["Key", "Documents", "Jewellery", "Laptop", "Passport", "Watch"] as const;

const NODE_LABELS: Record<string, string> = {
  "LK-022": "Ikeja (LK-022)",
  "LK-015": "Lekki (LK-015)",
};

function daysAgo(days: number, hour = 9): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 15, 0, 0);
  return date.toISOString();
}

function daysAhead(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(9, 15, 0, 0);
  return date.toISOString();
}

/** Safe storage rows — the showcase item SFE-10083 carries the extended booking timeline. */
export const SAFE_ITEM_ROWS: SafeItemRow[] = [
  {
    id: "SFE-10083",
    owner: "Olanrewaju Quadri",
    nodeId: "LK-015",
    storedAt: daysAgo(3),
    status: "active",
    flagged: false,
  },
  ...SAFE_STATUSES.map((status, index): SafeItemRow => {
    return {
      id: `SFE-${10100 + index}`,
      owner: OWNERS[index % OWNERS.length],
      nodeId: index % 3 === 2 ? "LK-015" : "LK-022",
      storedAt: daysAgo(1 + index),
      status,
      flagged: index === 2,
    };
  }),
];

export const SAFE_METRICS: WorkloadMetrics = {
  active: 3,
  retrieved: 1,
  pendingPickup: 2,
  expiringSoon: 1,
  expired: 1,
  flagged: 0,
};

export const SAFE_FILTER_OPTIONS: WorkloadFilterOptions = {
  statuses: ["active", "retrieved", "pending_pickup", "expiring_soon", "expired"],
  locations: [],
};

function step(key: SafeStepKey, detail: string, done: boolean): SafeTimelineStep {
  return {key, detail, done};
}

/** Default storage lifecycle — pending steps appear once the item progresses past them. */
function baseTimeline(row: SafeItemRow): SafeTimelineStep[] {
  const stored = row.status !== "pending_pickup";
  const lapsed = row.status === "expired" || row.status === "retrieved";
  const ago = "3 days ago";
  const node = `${row.nodeId} · VI, Lagos`;
  return [
    step("book_safe", ago, true),
    step("item_stored", stored ? `${node} · ${ago}` : "Pending · —", stored),
    step("storage_active", stored ? "Item secured in locker · Ongoing" : "Pending · —", stored),
    step("expires", lapsed ? `Expired ${row.storedAt.slice(0, 10)}` : "In 4 days", lapsed),
    step("retrieved", row.status === "retrieved" ? `Retrieved ${row.storedAt.slice(0, 10)}` : "Pending · —", row.status === "retrieved"),
  ];
}

/** The flagged showcase item's extended booking — original expiry, extension, new expiry. */
const EXTENDED_TIMELINE: SafeTimelineStep[] = [
  step("book_safe", "3 days ago", true),
  step("item_stored", "LK-022 · VI, Lagos · 3 days ago", true),
  step("storage_active", "Item secured in locker · Ongoing", true),
  step("expired", "Expired 20th May, 2026 | 08:51am", true),
  step("period_extended", "21th May, 2026 | 08:51am", true),
  step("expires", "In 2 days (21th May, 2026 | 08:51am)", false),
  step("retrieved", "Pending · —", false),
];

/** Detail for a Safe item — derived from its row; SFE-10083 mirrors the Figma drawer. */
export function safeItemDetailFor(id: string): SafeItemDetail | undefined {
  const row = SAFE_ITEM_ROWS.find((item) => item.id === id);
  if (!row) return undefined;
  const showcase = id === "SFE-10083";
  return {
    id: row.id,
    status: row.status,
    statusNote: "Dropped on 16 Mar 2026 at 2:34 PM",
    flag: row.flagged ? {reason: "other", notes: "User reports that item package seal is broken", at: "2026-03-16T11:00:00"} : null,
    owner: row.owner,
    node: NODE_LABELS[row.nodeId] ?? row.nodeId,
    item: ITEMS[SAFE_ITEM_ROWS.indexOf(row) % ITEMS.length],
    size: "Small - 1.8kg",
    charged: 1450,
    storedAt: row.storedAt,
    expiresAt: showcase ? daysAhead(2) : daysAhead(4),
    timeline: showcase ? EXTENDED_TIMELINE : baseTimeline(row),
  };
}
