import {apiClient} from "@/services/api-client";
import {fetchPage} from "@/services/paged";
import type {NodeDetail, NodeRow, NodesService, NodeStatus} from "@/types/nodes-types";

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

interface ApiAdminNode {
  id?: string;
  code?: string;
  lat?: number;
  lng?: number;
  details?: ApiNodeDetails;
  status?: string;
  statusReason?: string;
  statusNotes?: string;
  statusChangedAt?: string;
  capacity?: {small?: number; medium?: number; large?: number};
  adapterType?: string;
  liveParcels?: string;
  activatedAt?: string;
  createdAt?: string;
}

interface ApiMaintenance {
  id?: string;
  nodeId?: string;
  startsAt?: string;
  endsAt?: string;
  reasonCode?: string;
  notes?: string;
  status?: string;
  scheduledBy?: string;
  completedBy?: string;
  completedAt?: string;
}

interface ApiNodeDetail {
  node?: ApiAdminNode;
  operators?: {userId?: string; assignedAt?: string}[];
  contents?: {state?: string; parcels?: string}[];
  maintenance?: ApiMaintenance[];
}

const STATUS: Record<string, NodeStatus> = {
  ADMIN_NODE_STATUS_AVAILABLE: "online",
  ADMIN_NODE_STATUS_OFFLINE: "offline",
  ADMIN_NODE_STATUS_MAINTENANCE: "maintenance",
  ADMIN_NODE_STATUS_DECOMMISSIONED: "decommissioned",
};

const API_STATUS: Record<string, string> = {
  online: "ADMIN_NODE_STATUS_AVAILABLE",
  offline: "ADMIN_NODE_STATUS_OFFLINE",
  maintenance: "ADMIN_NODE_STATUS_MAINTENANCE",
  decommissioned: "ADMIN_NODE_STATUS_DECOMMISSIONED",
};

const cap = (c?: {small?: number; medium?: number; large?: number}) => (c ? (c.small ?? 0) + (c.medium ?? 0) + (c.large ?? 0) : 0);

const used = (n: ApiAdminNode) => Number(n.liveParcels ?? 0);

const str = (v?: string) => v ?? "";
const num = (v?: number) => v ?? 0;
const nodeName = (n: ApiAdminNode) => n.details?.name || n.code || "";
const nodeStatus = (n: ApiAdminNode) => STATUS[n.status ?? ""] ?? "offline";

const toRow = (n: ApiAdminNode): NodeRow => ({
  id: str(n.id),
  name: nodeName(n),
  partner: n.details?.partnerName ?? "",
  zone: n.details?.zone ?? "",
  capacity: {used: used(n), total: cap(n.capacity)},
  connectivity: "4g_lte",
  status: nodeStatus(n),
  position: [num(n.lng), num(n.lat)],
});

const field = (d: ApiNodeDetails | undefined, key: keyof ApiNodeDetails) => String(d?.[key] ?? "");

const MAINTENANCE_STATUS: Record<string, NodeDetail["maintenance"][number]["status"]> = {
  MAINTENANCE_STATUS_SCHEDULED: "scheduled",
  MAINTENANCE_STATUS_ACTIVE: "in_progress",
  MAINTENANCE_STATUS_COMPLETED: "completed",
  MAINTENANCE_STATUS_CANCELLED: "completed",
};

const reasonLabel = (code?: string) =>
  code
    ? code
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : "";

const toDetail = (res: ApiNodeDetail): NodeDetail => {
  const node = res.node ?? {};
  const d = node.details;
  return {
    id: str(node.id),
    code: str(node.code),
    name: nodeName(node),
    status: nodeStatus(node),
    partner: field(d, "partnerName"),
    zone: field(d, "zone"),
    region: field(d, "region"),
    address: field(d, "address"),
    installedAt: field(d, "installedAt"),
    uptimeToday: 0,
    lastHeartbeatAt: "",
    connectivity: "4g_lte",
    pickupOccupancy: {used: used(node), total: cap(node.capacity)},
    compartments: [],
    sensors: [],
    contents: [],
    maintenance: (res.maintenance ?? []).map((m) => ({
      id: m.id ?? "",
      title: reasonLabel(m.reasonCode) || (m.notes ?? ""),
      at: m.startsAt ?? "",
      vendor: m.scheduledBy ?? "",
      status: MAINTENANCE_STATUS[m.status ?? ""] ?? "scheduled",
    })),
    statusOptions: [
      {status: "online", reasons: ["activated", "restored", "maintenance_complete"]},
      {status: "offline", reasons: ["power_failure", "connectivity_issue", "hardware_fault", "other"]},
      {status: "maintenance", reasons: ["scheduled_service", "compartment_repair", "hardware_upgrade", "partner_request"]},
      {status: "decommissioned", reasons: ["partner_contract_ended", "location_closed", "replaced_by_new_node"]},
    ],
    position: [num(node.lng), num(node.lat)],
  };
};

const codeFor = (name: string) =>
  name
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 6)
    .toUpperCase() || "NODE01";

/**
 * Nodes against `v1/admin/nodes/**`. The wire carries no connectivity/sensors/compartment
 * telemetry — those stay empty until the API grows them. `registerNode` needs a code the
 * form never collects, so one is derived from the name for now. Text search isn't a list
 * param either, so `query` filters the fetched page client-side.
 */
export const httpNodesService: NodesService = {
  getNodes: async (params) => {
    const filters: Record<string, string> = {page_size: "100"};
    if (params.status && API_STATUS[params.status]) filters.status = API_STATUS[params.status];
    const key = JSON.stringify(filters);
    const res = await fetchPage<ApiAdminNode>(`nodes:${key}`, params.page, (pageToken) =>
      apiClient
        .get("v1/admin/nodes", {searchParams: {...filters, ...(pageToken ? {page_token: pageToken} : {})}})
        .json<{nodes: ApiAdminNode[]; nextPageToken?: string; total?: string}>()
        .then((r) => ({items: r.nodes ?? [], nextPageToken: r.nextPageToken, total: Number(r.total ?? 0)}))
    );
    const query = params.query?.trim().toLowerCase();
    const items = res.items
      .map(toRow)
      .filter(
        (n) =>
          !query || n.name.toLowerCase().includes(query) || n.zone.toLowerCase().includes(query) || n.partner.toLowerCase().includes(query)
      );
    return {
      metrics: {
        total: items.length,
        online: items.filter((n) => n.status === "online").length,
        offline: items.filter((n) => n.status !== "online").length,
      },
      nodes: {items, page: params.page, pageSize: items.length, total: res.total},
      filters: {statuses: ["online", "offline", "maintenance", "decommissioned"]},
    };
  },
  getNodeDetail: async (id) => {
    const res = await apiClient.get(`v1/admin/nodes/${id}`).json<ApiNodeDetail>();
    return toDetail(res);
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
      .json<ApiAdminNode>();
    return toRow(res);
  },
  changeNodeStatus: async (id, input) => {
    await apiClient.post(`v1/admin/nodes/${id}/status`, {
      json: {status: API_STATUS[input.status] ?? "ADMIN_NODE_STATUS_AVAILABLE", reasonCode: input.reason ?? "", notes: input.notes ?? ""},
    });
    return {id, status: input.status};
  },
  updateNode: async (id, input) => {
    const res = await apiClient
      .put(`v1/admin/nodes/${id}`, {
        json: {details: {name: input.name, partnerName: input.partner, region: input.region, zone: input.zone, address: input.address}},
      })
      .json<ApiAdminNode>();
    return toRow(res);
  },
  scheduleMaintenance: async (nodeId, input) => {
    const res = await apiClient
      .post(`v1/admin/nodes/${nodeId}/maintenance`, {
        json: {startsAt: input.startsAt, endsAt: input.endsAt, reasonCode: input.reasonCode, notes: input.notes ?? ""},
      })
      .json<ApiMaintenance>();
    return {id: res.id ?? ""};
  },
  completeMaintenance: async (nodeId, maintenanceId) => {
    await apiClient.post(`v1/admin/nodes/${nodeId}/maintenance/${maintenanceId}/complete`, {json: {}});
  },
  assignOperator: async (nodeId, userId) => {
    await apiClient.put(`v1/admin/nodes/${nodeId}/operators/${userId}`, {json: {}});
  },
  unassignOperator: async (nodeId, userId) => {
    await apiClient.delete(`v1/admin/nodes/${nodeId}/operators/${userId}`);
  },
};
