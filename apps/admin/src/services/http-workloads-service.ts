import * as v from "valibot";
import {apiClient} from "@/services/api-client";
import type {FlagParcelsInput, WorkloadListParams, WorkloadsService} from "@/types/workloads-types";

const ParcelStatusSchema = v.picklist(["pending_pickup", "in_transit", "delivered", "failed", "expired"]);
const SafeItemStatusSchema = v.picklist(["active", "pending_pickup", "expiring_soon", "expired", "retrieved"]);
const BatchTagSchema = v.picklist(["active", "completed", "queued", "stalled", "flagged"]);
const LngLatSchema = v.tuple([v.number(), v.number()]);

const MetricsSchema = v.partial(
  v.object({
    ongoing: v.number(),
    pendingPickup: v.number(),
    expired: v.number(),
    slaAtRisk: v.number(),
    flagged: v.number(),
    active: v.number(),
    queued: v.number(),
    slaBreaches: v.number(),
    expiredParcel: v.number(),
    total: v.number(),
    inTransit: v.number(),
    delivered: v.number(),
    expiringSoon: v.number(),
    retrieved: v.number(),
  })
);

const PageSchema = <TItem extends v.GenericSchema>(item: TItem) =>
  v.object({items: v.array(item), page: v.number(), pageSize: v.number(), total: v.number()});

const ParcelRowSchema = v.object({
  id: v.string(),
  sender: v.string(),
  recipient: v.optional(v.string()),
  destination: v.string(),
  courierId: v.nullable(v.string()),
  destinationNodeId: v.string(),
  lastNodeId: v.optional(v.string()),
  status: ParcelStatusSchema,
  slaRemainingMin: v.nullable(v.number()),
  flagged: v.boolean(),
});

const FilterOptionsSchema = v.object({
  statuses: v.array(v.string()),
  locations: v.array(v.object({id: v.string(), label: v.string()})),
});

const BatchRowSchema = v.object({
  id: v.string(),
  tags: v.array(BatchTagSchema),
  sme: v.string(),
  createdAt: v.string(),
  city: v.string(),
  totalValue: v.number(),
  parcelCount: v.number(),
  delivered: v.number(),
  breakdown: v.array(v.object({key: v.picklist(["delivered", "in_transit", "delayed"]), count: v.number()})),
});

const SafeItemRowSchema = v.object({
  id: v.string(),
  owner: v.string(),
  nodeId: v.string(),
  storedAt: v.string(),
  status: SafeItemStatusSchema,
  flagged: v.boolean(),
});

const ListResponseSchema = v.object({
  metrics: MetricsSchema,
  parcels: v.optional(PageSchema(ParcelRowSchema)),
  batches: v.optional(PageSchema(BatchRowSchema)),
  safeItems: v.optional(PageSchema(SafeItemRowSchema)),
  filters: FilterOptionsSchema,
});

const ParcelRouteSchema = v.object({
  label: v.optional(v.string()),
  steps: v.array(
    v.object({
      key: v.picklist(["created", "dropped_at_node", "picked_up", "delivered", "collected"]),
      actor: v.optional(v.string()),
      at: v.optional(v.string()),
    })
  ),
});

const ParcelDetailSchema = v.object({
  id: v.string(),
  serviceType: v.picklist(["standard", "express"]),
  status: ParcelStatusSchema,
  statusNote: v.optional(v.string()),
  flag: v.nullable(v.object({reason: v.string(), notes: v.optional(v.string()), at: v.string()})),
  sender: v.string(),
  recipient: v.string(),
  courier: v.nullable(v.object({id: v.string(), name: v.string(), avatarUrl: v.optional(v.string())})),
  route: v.object({from: v.string(), to: v.string()}),
  size: v.string(),
  charged: v.number(),
  slaRemainingMin: v.nullable(v.number()),
  routes: v.array(ParcelRouteSchema),
  tracking: v.optional(
    v.object({
      route: v.array(LngLatSchema),
      stops: v.array(v.object({id: v.string(), label: v.string(), position: LngLatSchema, tone: v.picklist(["default", "alert"])})),
      courierPosition: LngLatSchema,
      etaMinutes: v.number(),
      destinationPosition: LngLatSchema,
    })
  ),
});

const SafeItemDetailSchema = v.object({
  id: v.string(),
  status: SafeItemStatusSchema,
  statusNote: v.optional(v.string()),
  flag: v.nullable(v.object({reason: v.string(), notes: v.optional(v.string()), at: v.string()})),
  owner: v.string(),
  node: v.string(),
  item: v.string(),
  size: v.string(),
  charged: v.number(),
  storedAt: v.string(),
  expiresAt: v.string(),
  timeline: v.array(
    v.object({
      key: v.picklist(["book_safe", "item_stored", "storage_active", "expired", "period_extended", "expires", "retrieved"]),
      detail: v.string(),
      done: v.boolean(),
    })
  ),
});

const BatchDetailSchema = v.object({
  id: v.string(),
  tags: v.array(BatchTagSchema),
  sme: v.string(),
  createdAt: v.string(),
  city: v.string(),
  totalValue: v.number(),
  parcelCount: v.number(),
  delivered: v.number(),
  metrics: MetricsSchema,
  filters: FilterOptionsSchema,
});

function listSearchParams(params: WorkloadListParams) {
  return {
    tab: params.tab,
    page: params.page,
    ...(params.query ? {q: params.query} : {}),
    ...(params.status ? {status: params.status} : {}),
    ...(params.location ? {location: params.location} : {}),
  };
}

/** Workloads over the real backend. The endpoint paths are placeholders until the API exists. */
export const httpWorkloadsService: WorkloadsService = {
  getWorkloads: async (params) => {
    const body = await apiClient.get("workloads", {searchParams: listSearchParams(params)}).json();
    return v.parse(ListResponseSchema, body);
  },
  getBatchDetail: async (id) => {
    const body = await apiClient.get(`workloads/batches/${id}`).json();
    return v.parse(BatchDetailSchema, body);
  },
  getBatchParcels: async (batchId, params) => {
    const body = await apiClient.get(`workloads/batches/${batchId}/parcels`, {searchParams: listSearchParams(params)}).json();
    return v.parse(PageSchema(ParcelRowSchema), body);
  },
  getParcelDetail: async (id) => {
    const body = await apiClient.get(`workloads/parcels/${id}`).json();
    return v.parse(ParcelDetailSchema, body);
  },
  getSafeItemDetail: async (id) => {
    const body = await apiClient.get(`workloads/safe/${id}`).json();
    return v.parse(SafeItemDetailSchema, body);
  },
  flagParcels: async (input: FlagParcelsInput) => {
    const body = await apiClient.post("workloads/parcels/flag", {json: input}).json();
    return v.parse(v.object({flagged: v.number()}), body);
  },
  exportList: (params) =>
    apiClient
      .get(
        params.batchId
          ? `workloads/batches/${params.batchId}/parcels/export`
          : params.tab === "batches"
            ? "workloads/batches/export"
            : params.tab === "safe"
              ? "workloads/safe/export"
              : "workloads/parcels/export",
        {
          searchParams: listSearchParams(params),
        }
      )
      .text(),
};
