import {apiClient} from "@/services/api-client";
import {fetchPage} from "@/services/paged";
import {koboToNaira} from "@/lib/money";
import type {BatchRow, ParcelDetail, ParcelFlagRecord, ParcelRow, ParcelStatus, ParcelTimelineStep} from "@/types/workloads-types";

interface ApiNodeRef {
  id?: string;
  code?: string;
  name?: string;
}

export interface ApiAdminParcel {
  id?: string;
  trackingNo?: string;
  label?: string;
  state?: string;
  speedTier?: string;
  sizeClass?: string;
  priceKobo?: string;
  sender?: {kind?: string; id?: string; name?: string; code?: string; email?: string; phone?: string};
  origin?: ApiNodeRef;
  destination?: ApiNodeRef;
  batchId?: string;
  createdAt?: string;
  slaDueAt?: string;
  slaAtRisk?: boolean;
}

interface ApiLabelCount {
  label?: string;
  parcels?: string;
}

export interface ApiParcelStats {
  labels?: ApiLabelCount[];
  slaAtRisk?: string;
}

export interface ApiAdminBatch {
  id?: string;
  code?: string;
  smeId?: string;
  smeName?: string;
  fileName?: string;
  origin?: ApiNodeRef;
  totalParcels?: number;
  totalPriceKobo?: string;
  status?: string;
  createdAt?: string;
  progress?: {labels?: ApiLabelCount[]; slaAtRisk?: string; delivered?: string; inTransit?: string};
}

interface ApiParcelEvent {
  id?: string;
  fromState?: string;
  toState?: string;
  actorType?: string;
  actorId?: string;
  createdAt?: string;
}

export interface ApiParcelDetail {
  parcel?: ApiAdminParcel;
  fragile?: boolean;
  weightGrams?: number;
  batchCode?: string;
  recipient?: {name?: string; phone?: string};
  timeline?: ApiParcelEvent[];
}

export interface ApiFlag {
  id?: string;
  reasonCode?: string;
  notes?: string;
  createdAt?: string;
}

const STATUS: Record<string, ParcelStatus> = {
  PARCEL_STATE_CREATED: "pending_pickup",
  PARCEL_STATE_PAID: "pending_pickup",
  PARCEL_STATE_CODE_ISSUED: "pending_pickup",
  PARCEL_STATE_AT_ORIGIN: "pending_pickup",
  PARCEL_STATE_IN_TRANSIT: "in_transit",
  PARCEL_STATE_AT_DEST: "delivered",
  PARCEL_STATE_COLLECTED: "delivered",
  PARCEL_STATE_EXPIRED: "expired",
  PARCEL_STATE_CANCELLED: "failed",
  PARCEL_STATE_RETURNED: "failed",
};

/** The parcel `label` filter is the grouping enum, not the raw state. */
export const LABEL: Record<string, string> = {
  pending_pickup: "ADMIN_PARCEL_LABEL_PENDING_PICKUP",
  in_transit: "ADMIN_PARCEL_LABEL_IN_TRANSIT",
  delivered: "ADMIN_PARCEL_LABEL_DELIVERED",
  failed: "ADMIN_PARCEL_LABEL_EXPIRED_OR_FAILED",
  expired: "ADMIN_PARCEL_LABEL_EXPIRED_OR_FAILED",
};

/** Timeline steps are keyed off the event's target state. */
const STEP: Record<string, ParcelTimelineStep["key"]> = {
  PARCEL_STATE_AT_ORIGIN: "dropped_at_node",
  PARCEL_STATE_IN_TRANSIT: "picked_up",
  PARCEL_STATE_AT_DEST: "delivered",
  PARCEL_STATE_COLLECTED: "collected",
};

const slaMin = (due?: string) => (due ? Math.max(0, Math.round((Date.parse(due) - Date.now()) / 60000)) : null);

const nodeLabel = (n?: ApiNodeRef) => (n ? `${n.name ?? n.code ?? ""} (${n.code ?? ""})` : "");

export const toRow = (p: ApiAdminParcel): ParcelRow => ({
  id: p.id ?? "",
  sender: p.sender?.name ?? p.trackingNo ?? "",
  destination: nodeLabel(p.destination),
  courierId: null,
  destinationNodeId: p.destination?.id ?? "",
  status: STATUS[p.state ?? ""] ?? "pending_pickup",
  slaRemainingMin: slaMin(p.slaDueAt),
  flagged: p.slaAtRisk ?? false,
});

const batchTag = (status?: string): BatchRow["tags"] =>
  status === "completed" ? ["completed"] : status === "failed" ? ["stalled"] : ["active"];

const progressAt = (b: ApiAdminBatch, key: "delivered" | "inTransit") => Number(b.progress?.[key] ?? 0);

const labelCount = (labels: ApiLabelCount[] | undefined, wanted: string[]) =>
  (labels ?? []).filter((l) => wanted.includes(l.label ?? "")).reduce((sum, l) => sum + Number(l.parcels ?? 0), 0);

export const toBatch = (b: ApiAdminBatch): BatchRow => {
  const delayed = labelCount(b.progress?.labels, ["ADMIN_PARCEL_LABEL_EXPIRED_OR_FAILED", "ADMIN_PARCEL_LABEL_CANCELLED"]);
  return {
    id: b.id ?? "",
    tags: batchTag(b.status),
    sme: b.smeName ?? "",
    createdAt: b.createdAt ?? "",
    city: b.origin?.name ?? "",
    totalValue: koboToNaira(b.totalPriceKobo),
    parcelCount: b.totalParcels ?? 0,
    delivered: progressAt(b, "delivered"),
    breakdown: [
      {key: "delivered", count: progressAt(b, "delivered")},
      {key: "in_transit", count: progressAt(b, "inTransit")},
      {key: "delayed", count: delayed},
    ],
  };
};

const serviceTier = (tier?: string): ParcelDetail["serviceType"] =>
  tier === "SPEED_TIER_EXPRESS" || tier === "SPEED_TIER_SAME_DAY" ? "express" : "standard";

const toSteps = (parcel: ApiAdminParcel, timeline?: ApiParcelEvent[]): ParcelTimelineStep[] => [
  {key: "created" as const, at: parcel.createdAt},
  ...(timeline ?? []).flatMap((e): ParcelTimelineStep[] => {
    const key = STEP[e.toState ?? ""];
    return key ? [{key, actor: e.actorId || e.actorType, at: e.createdAt}] : [];
  }),
];

const str = (v?: string) => v ?? "";
const parcelStatus = (p: ApiAdminParcel) => STATUS[p.state ?? ""] ?? "pending_pickup";
const sizeClass = (p: ApiAdminParcel) => p.sizeClass?.replace("SIZE_CLASS_", "").toLowerCase() ?? "";

export const toDetail = (res: ApiParcelDetail, flag: ParcelFlagRecord | null): ParcelDetail => {
  const parcel = res.parcel ?? {};
  return {
    id: str(parcel.id),
    serviceType: serviceTier(parcel.speedTier),
    status: parcelStatus(parcel),
    flag,
    sender: str(parcel.sender?.name),
    recipient: str(res.recipient?.name),
    courier: null,
    route: {from: nodeLabel(parcel.origin), to: nodeLabel(parcel.destination)},
    size: sizeClass(parcel),
    charged: koboToNaira(parcel.priceKobo),
    slaRemainingMin: slaMin(parcel.slaDueAt),
    routes: [{steps: toSteps(parcel, res.timeline)}],
  };
};

export const metrics = (stats?: ApiParcelStats) => ({
  total: (stats?.labels ?? []).reduce((sum, l) => sum + Number(l.parcels ?? 0), 0),
  inTransit: labelCount(stats?.labels, ["ADMIN_PARCEL_LABEL_IN_TRANSIT"]),
  pendingPickup: labelCount(stats?.labels, ["ADMIN_PARCEL_LABEL_AWAITING_DROPOFF", "ADMIN_PARCEL_LABEL_PENDING_PICKUP"]),
  delivered: labelCount(stats?.labels, ["ADMIN_PARCEL_LABEL_DELIVERED", "ADMIN_PARCEL_LABEL_COLLECTED"]),
  expired: labelCount(stats?.labels, ["ADMIN_PARCEL_LABEL_EXPIRED_OR_FAILED", "ADMIN_PARCEL_LABEL_CANCELLED"]),
  slaAtRisk: Number(stats?.slaAtRisk ?? 0),
});

export const listParcels = (page: number, extra?: Record<string, string>) =>
  fetchPage<ApiAdminParcel, {stats?: ApiParcelStats}>(`parcels:${JSON.stringify(extra ?? {})}`, page, (pageToken) =>
    apiClient
      .get("v1/admin/parcels", {
        searchParams: {page_size: "50", ...extra, ...(pageToken ? {page_token: pageToken} : {})},
      })
      .json<{parcels: ApiAdminParcel[]; nextPageToken?: string; total?: string; stats?: ApiParcelStats}>()
      .then((r) => ({items: r.parcels ?? [], nextPageToken: r.nextPageToken, total: Number(r.total ?? 0), stats: r.stats}))
  );
