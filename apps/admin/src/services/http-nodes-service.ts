import * as v from "valibot";
import {apiClient} from "@/services/api-client";
import type {ChangeNodeStatusInput, NodesService, RegisterNodeInput} from "@/types/nodes-types";

const NodeStatusSchema = v.picklist(["online", "offline", "warning", "maintenance", "full", "decommissioned"]);
const ConnectivitySchema = v.picklist(["4g_lte", "3g", "unstable", "no_signal"]);
const LngLatSchema = v.tuple([v.number(), v.number()]);
const CapacitySchema = v.object({used: v.number(), total: v.number()});

const NodeRowSchema = v.object({
  id: v.string(),
  name: v.string(),
  partner: v.string(),
  zone: v.string(),
  capacity: CapacitySchema,
  connectivity: ConnectivitySchema,
  status: NodeStatusSchema,
  position: LngLatSchema,
});

const ListResponseSchema = v.object({
  metrics: v.partial(
    v.object({
      total: v.number(),
      online: v.number(),
      offline: v.number(),
      warning: v.number(),
      maintenance: v.number(),
      fullCapacity: v.number(),
    })
  ),
  nodes: v.object({items: v.array(NodeRowSchema), page: v.number(), pageSize: v.number(), total: v.number()}),
  filters: v.object({statuses: v.array(v.string())}),
});

const CompartmentGroupSchema = v.object({
  key: v.picklist(["pickup", "dropoff"]),
  used: v.number(),
  total: v.number(),
  unit: v.picklist(["slots", "kg"]),
  breakdown: v.array(v.object({size: v.picklist(["small", "medium", "large"]), count: v.number(), unit: v.picklist(["slots", "items"])})),
});

const NodeDetailSchema = v.object({
  id: v.string(),
  code: v.string(),
  name: v.string(),
  status: NodeStatusSchema,
  partner: v.string(),
  zone: v.string(),
  region: v.string(),
  address: v.string(),
  installedAt: v.string(),
  uptimeToday: v.number(),
  lastHeartbeatAt: v.string(),
  connectivity: ConnectivitySchema,
  pickupOccupancy: CapacitySchema,
  compartments: v.array(CompartmentGroupSchema),
  sensors: v.array(
    v.object({
      key: v.picklist(["network", "power", "door", "tamper"]),
      label: v.string(),
      value: v.string(),
      tone: v.picklist(["ok", "warn"]),
    })
  ),
  contents: v.array(
    v.object({
      id: v.string(),
      kind: v.picklist(["parcel", "safe"]),
      owner: v.string(),
      slot: v.string(),
      sinceAt: v.string(),
      label: v.string(),
    })
  ),
  maintenance: v.array(
    v.object({
      id: v.string(),
      title: v.string(),
      at: v.string(),
      vendor: v.string(),
      status: v.picklist(["completed", "scheduled", "in_progress"]),
    })
  ),
  statusOptions: v.array(v.object({status: NodeStatusSchema, reasons: v.nullable(v.array(v.string()))})),
  position: LngLatSchema,
});

/** Nodes over the real backend. The endpoint paths are placeholders until the API exists. */
export const httpNodesService: NodesService = {
  getNodes: async (params) => {
    const body = await apiClient
      .get("nodes", {
        searchParams: {page: params.page, ...(params.query ? {q: params.query} : {}), ...(params.status ? {status: params.status} : {})},
      })
      .json();
    return v.parse(ListResponseSchema, body);
  },
  getNodeDetail: async (id) => {
    const body = await apiClient.get(`nodes/${id}`).json();
    return v.parse(NodeDetailSchema, body);
  },
  registerNode: async (input: RegisterNodeInput) => {
    const body = await apiClient.post("nodes", {json: input}).json();
    return v.parse(NodeRowSchema, body);
  },
  changeNodeStatus: async (id, input: ChangeNodeStatusInput) => {
    const body = await apiClient.patch(`nodes/${id}/status`, {json: input}).json();
    return v.parse(v.object({id: v.string(), status: NodeStatusSchema}), body);
  },
};
