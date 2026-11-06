import {apiClient} from "@/services/api-client";
import {koboToNaira} from "@/lib/money";
import type {Page} from "@/types/workloads-types";
import type {BatchDetail, BatchRow, ParcelDetail, ParcelRow, ParcelStatus, WorkloadsService} from "@/types/workloads-types";

interface ApiNodeRef {
  id: string;
  code: string;
  name?: string;
}

interface ApiAdminParcel {
  id: string;
  trackingNo: string;
  label?: string;
  state: string;
  speedTier?: string;
  sizeClass?: string;
  priceKobo: string;
  sender?: {id?: string; name?: string};
  origin?: ApiNodeRef;
  destination?: ApiNodeRef;
  batchId?: string;
  createdAt: string;
  slaDueAt?: string;
  slaAtRisk?: boolean;
  flagged?: boolean;
}

interface ApiAdminBatch {
  id: string;
  code: string;
  smeId?: string;
  smeName?: string;
  fileName?: string;
  origin?: ApiNodeRef;
  totalParcels: number;
  totalPriceKobo: string;
  status: string;
  createdAt: string;
  progress?: {delivered?: string; inTransit?: string; failed?: string};
}

interface ApiParcelDetail {
  parcel: ApiAdminParcel;
  events?: {toState: string; createdAt: string; nodeId?: string}[];
  flag?: {reasonCode: string; notes?: string; createdAt: string};
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

const slaMin = (due?: string) => (due ? Math.max(0, Math.round((Date.parse(due) - Date.now()) / 60000)) : null);

const nodeLabel = (n?: ApiNodeRef) => (n ? `${n.name ?? n.code} (${n.code})` : "");

const toRow = (p: ApiAdminParcel): ParcelRow => ({
  id: p.id,
  sender: p.sender?.name ?? p.trackingNo,
  destination: nodeLabel(p.destination),
  courierId: null,
  destinationNodeId: p.destination?.id ?? "",
  status: STATUS[p.state] ?? "pending_pickup",
  slaRemainingMin: slaMin(p.slaDueAt),
  flagged: p.flagged ?? p.slaAtRisk ?? false,
});

const batchTag = (status: string): BatchRow["tags"] =>
  status === "completed" ? ["completed"] : status === "failed" ? ["stalled"] : ["active"];

const progressAt = (b: ApiAdminBatch, key: "delivered" | "inTransit" | "failed") => Number(b.progress?.[key] ?? 0);

const toBatch = (b: ApiAdminBatch): BatchRow => ({
  id: b.id,
  tags: batchTag(b.status),
  sme: b.smeName ?? "",
  createdAt: b.createdAt,
  city: b.origin?.name ?? "",
  totalValue: koboToNaira(b.totalPriceKobo),
  parcelCount: b.totalParcels,
  delivered: progressAt(b, "delivered"),
  breakdown: [
    {key: "delivered", count: progressAt(b, "delivered")},
    {key: "in_transit", count: progressAt(b, "inTransit")},
    {key: "delayed", count: progressAt(b, "failed")},
  ],
});

const toDetail = (res: ApiParcelDetail): ParcelDetail => {
  const {parcel} = res;
  return {
    id: parcel.id,
    serviceType: parcel.speedTier === "SPEED_TIER_EXPRESS" || parcel.speedTier === "SPEED_TIER_SAME_DAY" ? "express" : "standard",
    status: STATUS[parcel.state] ?? "pending_pickup",
    flag: res.flag ? {reason: res.flag.reasonCode, notes: res.flag.notes, at: res.flag.createdAt} : null,
    sender: parcel.sender?.name ?? "",
    recipient: "",
    courier: null,
    route: {from: nodeLabel(parcel.origin), to: nodeLabel(parcel.destination)},
    size: parcel.sizeClass?.replace("SIZE_CLASS_", "").toLowerCase() ?? "",
    charged: koboToNaira(parcel.priceKobo),
    slaRemainingMin: slaMin(parcel.slaDueAt),
    routes: [
      {
        steps: [
          {key: "created" as const, at: parcel.createdAt},
          ...(res.events ?? []).map((e) => ({key: "delivered" as const, actor: e.nodeId, at: e.createdAt})),
        ],
      },
    ],
  };
};

const metrics = (items: ParcelRow[]) => ({
  total: items.length,
  inTransit: items.filter((p) => p.status === "in_transit").length,
  pendingPickup: items.filter((p) => p.status === "pending_pickup").length,
  delivered: items.filter((p) => p.status === "delivered").length,
  expired: items.filter((p) => p.status === "expired" || p.status === "failed").length,
  flagged: items.filter((p) => p.flagged).length,
});

const listParcels = (extra?: Record<string, string>) => {
  const searchParams = new URLSearchParams({pageSize: "50", ...extra});
  return apiClient.get("v1/admin/parcels", {searchParams}).json<{parcels: ApiAdminParcel[]; nextPageToken: string; total: string}>();
};

const listBatches = () =>
  apiClient.get("v1/admin/batches", {searchParams: {pageSize: 50}}).json<{batches: ApiAdminBatch[]; total?: string}>();

const UNSUPPORTED = "not supported by the API yet";

/**
 * Workloads against `v1/admin/parcels`, `v1/admin/batches` and `v1/admin/flags`. The Safe
 * tab, live tracking, recipient/courier joins, and CSV exports have no endpoints —
 * `safeItems`, `getSafeItemDetail` and `exportList` throw or return empty.
 */
export const httpWorkloadsService: WorkloadsService = {
  getWorkloads: async (params) => {
    if (params.tab === "batches") {
      const res = await listBatches();
      const items = res.batches.map(toBatch);
      return {
        metrics: {total: items.length},
        batches: {items, page: params.page, pageSize: items.length, total: Number(res.total ?? items.length)},
        filters: {statuses: [], locations: []},
      };
    }
    if (params.tab === "safe") {
      return {metrics: {}, safeItems: {items: [], page: params.page, pageSize: 0, total: 0}, filters: {statuses: [], locations: []}};
    }
    const extra: Record<string, string> = {};
    if (params.query) extra.query = params.query;
    if (params.status) extra.status = params.status;
    if (params.location) extra.location = params.location;
    if (params.batchId) extra.batchId = params.batchId;
    const res = await listParcels(extra);
    const items = res.parcels.map(toRow);
    return {
      metrics: metrics(items),
      parcels: {items, page: params.page, pageSize: 50, total: Number(res.total)},
      filters: {statuses: [], locations: []},
    };
  },
  getBatchDetail: async (id): Promise<BatchDetail> => {
    const res = await apiClient.get(`v1/admin/batches/${id}`).json<{batch: ApiAdminBatch}>();
    const row = toBatch(res.batch);
    return {...row, metrics: {total: row.parcelCount, delivered: row.delivered}, filters: {statuses: [], locations: []}};
  },
  getBatchParcels: async (batchId, params): Promise<Page<ParcelRow>> => {
    const res = await listParcels({batchId});
    const items = res.parcels.map(toRow);
    return {items, page: params.page, pageSize: 50, total: Number(res.total)};
  },
  getParcelDetail: async (id) => {
    const res = await apiClient.get(`v1/admin/parcels/${id}`).json<ApiParcelDetail>();
    return toDetail(res);
  },
  getSafeItemDetail: async () => {
    throw new Error(`safe item detail is ${UNSUPPORTED}`);
  },
  flagParcels: async (input) => {
    await Promise.all(
      input.ids.map((id) =>
        apiClient.post("v1/admin/flags", {
          json: {targetType: "FLAG_TARGET_TYPE_PARCEL", targetId: id, reasonCode: input.reason, notes: input.notes ?? ""},
        })
      )
    );
    return {flagged: input.ids.length};
  },
  exportList: async () => {
    throw new Error(`export is ${UNSUPPORTED}`);
  },
  revealParcel: async (id, password) => {
    const step = await apiClient.post("v1/admin/auth/step-up", {json: {password}}).json<{stepUpToken?: string}>();
    const res = await apiClient
      .post(`v1/admin/parcels/${id}/reveal`, {json: {stepUpToken: step.stepUpToken ?? ""}})
      .json<{sender?: {name?: string}; recipient?: {name?: string}}>();
    return {sender: res.sender?.name, recipient: res.recipient?.name};
  },
};
