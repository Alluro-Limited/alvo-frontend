import {apiClient} from "@/services/api-client";
import type {NodeDetail, NodeRow, NodesService, NodeStatus} from "@/types/nodes-types";

interface ApiNode {
  id: string;
  code: string;
  name: string;
  lat: number;
  lng: number;
  status: string;
  capacity?: {small: number; medium: number; large: number};
  available?: {small: number; medium: number; large: number};
}

interface ApiNodeDetails {
  name?: string;
  partnerName?: string;
  region?: string;
  zone?: string;
  address?: string;
  accessNotes?: string;
  hours?: string;
  dropoffCapacityKg?: number;
  installedAt?: string;
}

const STATUS: Record<string, NodeStatus> = {NODE_STATUS_AVAILABLE: "online", NODE_STATUS_OFFLINE: "offline"};

const cap = (c?: {small: number; medium: number; large: number}) => (c ? c.small + c.medium + c.large : 0);

const toRow = (n: ApiNode): NodeRow => ({
  id: n.id,
  name: n.name,
  partner: "",
  zone: "",
  capacity: {used: Math.max(cap(n.capacity) - cap(n.available), 0), total: cap(n.capacity)},
  connectivity: "4g_lte",
  status: STATUS[n.status] ?? "offline",
  position: [n.lng, n.lat],
});

const field = (d: ApiNodeDetails | null, key: keyof ApiNodeDetails) => String(d?.[key] ?? "");

const toDetail = (n: ApiNode, d: ApiNodeDetails | null): NodeDetail => ({
  id: n.id,
  code: n.code,
  name: field(d, "name") || n.name,
  status: STATUS[n.status] ?? "offline",
  partner: field(d, "partnerName"),
  zone: field(d, "zone"),
  region: field(d, "region"),
  address: field(d, "address"),
  installedAt: field(d, "installedAt"),
  uptimeToday: 0,
  lastHeartbeatAt: "",
  connectivity: "4g_lte",
  pickupOccupancy: {used: Math.max(cap(n.capacity) - cap(n.available), 0), total: cap(n.capacity)},
  compartments: [],
  sensors: [],
  contents: [],
  maintenance: [],
  statusOptions: [
    {status: "online", reasons: null},
    {status: "offline", reasons: ["maintenance", "decommissioned"]},
  ],
  position: [n.lng, n.lat],
});

const codeFor = (name: string) =>
  name
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 6)
    .toUpperCase() || "NODE01";

/**
 * Nodes against `v1/admin/nodes/**`. The wire carries only AVAILABLE/OFFLINE statuses and
 * no connectivity/sensors/contents/maintenance-telemetry — those stay empty until the API
 * grows them. `registerNode` needs a code the form never collects, so one is derived from
 * the name for now.
 */
export const httpNodesService: NodesService = {
  getNodes: async (params) => {
    const searchParams = new URLSearchParams({pageSize: "100"});
    if (params.query) searchParams.set("query", params.query);
    if (params.status) searchParams.set("status", params.status);
    const res = await apiClient.get("v1/admin/nodes", {searchParams}).json<{nodes: ApiNode[]; total?: string}>();
    const items = res.nodes.map(toRow);
    return {
      metrics: {
        total: items.length,
        online: items.filter((n) => n.status === "online").length,
        offline: items.filter((n) => n.status === "offline").length,
      },
      nodes: {items, page: params.page, pageSize: items.length, total: Number(res.total ?? items.length)},
      filters: {statuses: ["online", "offline"]},
    };
  },
  getNodeDetail: async (id) => {
    const res = await apiClient.get(`v1/admin/nodes/${id}`).json<{node: ApiNode; details?: ApiNodeDetails}>();
    return toDetail(res.node, res.details ?? null);
  },
  registerNode: async (input) => {
    const res = await apiClient
      .post("v1/admin/nodes", {
        json: {
          code: codeFor(input.name),
          details: {
            name: input.name,
            partnerName: input.partner,
            region: input.region,
            zone: input.zone,
            address: input.address,
            dropoffCapacityKg: input.capacity.dropoffKg,
          },
          lat: input.latitude,
          lng: input.longitude,
          capacity: {small: input.capacity.small, medium: input.capacity.medium, large: input.capacity.large},
          adapterType: "NODE_ADAPTER_TYPE_SMART_LOCKER",
        },
      })
      .json<{node: ApiNode}>();
    return toRow(res.node);
  },
  changeNodeStatus: async (id, input) => {
    await apiClient.post(`v1/admin/nodes/${id}/status`, {
      json: {status: input.status === "offline" ? "NODE_STATUS_OFFLINE" : "NODE_STATUS_AVAILABLE", notes: input.notes ?? ""},
    });
    return {id, status: input.status};
  },
  updateNode: async (id, input) => {
    const res = await apiClient
      .put(`v1/admin/nodes/${id}`, {
        json: {details: {name: input.name, partnerName: input.partner, region: input.region, zone: input.zone, address: input.address}},
      })
      .json<{node: ApiNode}>();
    return toRow(res.node);
  },
  scheduleMaintenance: async (nodeId, input) => {
    const res = await apiClient.post(`v1/admin/nodes/${nodeId}/maintenance`, {json: input}).json<{maintenance?: {id?: string}}>();
    return {id: res.maintenance?.id ?? ""};
  },
  completeMaintenance: async (nodeId, maintenanceId) => {
    await apiClient.post(`v1/admin/nodes/${nodeId}/maintenance/${maintenanceId}/complete`, {json: {}});
  },
  assignOperator: async (nodeId, userId) => {
    await apiClient.put(`v1/admin/nodes/${nodeId}/operators/${userId}`);
  },
  unassignOperator: async (nodeId, userId) => {
    await apiClient.delete(`v1/admin/nodes/${nodeId}/operators/${userId}`);
  },
};
