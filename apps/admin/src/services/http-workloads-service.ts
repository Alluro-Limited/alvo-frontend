import * as v from "valibot";
import {apiClient} from "@/services/api-client";
import type {FlagParcelsInput, WorkloadListParams, WorkloadsService} from "@/types/workloads-types";

const ParcelStatusSchema = v.picklist(["pending_pickup", "in_transit", "delivered", "failed", "expired"]);
const LngLatSchema = v.tuple([v.number(), v.number()]);

const ListResponseSchema = v.object({
  metrics: v.object({
    ongoing: v.number(),
    pendingPickup: v.number(),
    expired: v.number(),
    slaAtRisk: v.number(),
    flagged: v.number(),
  }),
  parcels: v.object({
    items: v.array(
      v.object({
        id: v.string(),
        sender: v.string(),
        destination: v.string(),
        courierId: v.nullable(v.string()),
        destinationNodeId: v.string(),
        status: ParcelStatusSchema,
        slaRemainingMin: v.nullable(v.number()),
        flagged: v.boolean(),
      })
    ),
    page: v.number(),
    pageSize: v.number(),
    total: v.number(),
  }),
  filters: v.object({
    statuses: v.array(ParcelStatusSchema),
    nodes: v.array(v.object({id: v.string(), label: v.string()})),
  }),
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
  timeline: v.array(
    v.object({
      key: v.picklist(["created", "dropped_at_node", "picked_up", "delivered", "collected"]),
      actor: v.optional(v.string()),
      at: v.optional(v.string()),
    })
  ),
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

function listSearchParams(params: WorkloadListParams) {
  return {
    tab: params.tab,
    page: params.page,
    ...(params.query ? {q: params.query} : {}),
    ...(params.status ? {status: params.status} : {}),
    ...(params.nodeId ? {nodeId: params.nodeId} : {}),
  };
}

/** Workloads over the real backend. The endpoint paths are placeholders until the API exists. */
export const httpWorkloadsService: WorkloadsService = {
  getWorkloads: async (params) => {
    const body = await apiClient.get("workloads", {searchParams: listSearchParams(params)}).json();
    return v.parse(ListResponseSchema, body);
  },
  getParcelDetail: async (id) => {
    const body = await apiClient.get(`workloads/parcels/${id}`).json();
    return v.parse(ParcelDetailSchema, body);
  },
  flagParcels: async (input: FlagParcelsInput) => {
    const body = await apiClient.post("workloads/parcels/flag", {json: input}).json();
    return v.parse(v.object({flagged: v.number()}), body);
  },
  exportParcels: (params) => apiClient.get("workloads/parcels/export", {searchParams: listSearchParams(params)}).text(),
};
