import {apiClient} from "@/services/api-client";
import type {AlertSeverity, DashboardService, NodeDetail, OverviewAlert, OverviewMapNode} from "@/types/dashboard-types";

interface ApiOverview {
  parcelsToday: string;
  inTransit: string;
  deliveredToday: string;
  deliveryRate?: {onTime?: string; late?: string; failed?: string};
  activeNodes: string;
  registeredNodes: string;
  onlineCouriers: string;
  slaAtRisk: string;
}

interface ApiAlert {
  kind: string;
  targetId: string;
  targetRef: string;
  raisedAt: string;
  parcelsAffected: string;
}

interface ApiActivity {
  id: string;
  actorRole: string;
  action: string;
  targetType: string;
  targetId: string;
  createdAt: string;
}

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

const cap = (c?: {small: number; medium: number; large: number}) => (c ? c.small + c.medium + c.large : 0);

const ALERT_TONE: Record<string, AlertSeverity> = {
  ALERT_KIND_NODE_OFFLINE: "error",
  ALERT_KIND_SLA_AT_RISK: "warning",
};

const toAlert = (a: ApiAlert): OverviewAlert => ({
  id: a.targetId,
  severity: ALERT_TONE[a.kind] ?? "warning",
  title: a.targetRef,
  description: a.kind.replace("ALERT_KIND_", "").replaceAll("_", " ").toLowerCase(),
  at: a.raisedAt,
});

/**
 * Dashboard against `v1/admin/overview{,/activity,/alerts}` and `v1/admin/nodes` for the
 * map markers. There are no courier-position/route feeds and no courier popover endpoint —
 * those stay empty or throw.
 */
export const httpDashboardService: DashboardService = {
  getOverview: async () => {
    const [overview, alerts, activity, nodes] = await Promise.all([
      apiClient.get("v1/admin/overview").json<ApiOverview>(),
      apiClient.get("v1/admin/overview/alerts", {searchParams: {pageSize: 10}}).json<{alerts: ApiAlert[]}>(),
      apiClient.get("v1/admin/overview/activity", {searchParams: {pageSize: 10}}).json<{activity: ApiActivity[]}>(),
      apiClient.get("v1/admin/nodes").json<{nodes: ApiNode[]}>(),
    ]);
    const nodesTotal = Number(overview.registeredNodes);
    const nodesOnline = Number(overview.activeNodes);
    const mapNodes: OverviewMapNode[] = nodes.nodes.map((n) => ({
      id: n.id,
      status: n.status === "NODE_STATUS_AVAILABLE" ? "online" : "offline",
      position: [n.lng, n.lat],
    }));
    return {
      firstRun: false,
      kpis: {
        activeParcels: Number(overview.inTransit),
        nodesOnline,
        nodesTotal,
        nodesUptimePct: nodesTotal ? Math.round((nodesOnline / nodesTotal) * 100) : undefined,
        couriersActive: Number(overview.onlineCouriers),
        couriersRegistered: Number(overview.onlineCouriers),
        revenueToday: 0,
      },
      deliveryRate: {
        today: Number(overview.deliveredToday),
        onTime: Number(overview.deliveryRate?.onTime ?? 0),
        late: Number(overview.deliveryRate?.late ?? 0),
        failed: Number(overview.deliveryRate?.failed ?? 0),
      },
      map: {nodes: mapNodes, couriers: [], route: []},
      alerts: alerts.alerts.map(toAlert),
      activity: activity.activity.map((a) => ({
        id: a.id,
        tone: "success" as const,
        title: a.action,
        detail: `${a.actorRole || "system"} · ${a.targetId}`,
        at: a.createdAt,
      })),
    };
  },
  getNodeDetail: async (id): Promise<NodeDetail> => {
    const res = await apiClient.get(`v1/admin/nodes/${id}`).json<{node: ApiNode}>();
    const {node} = res;
    const total = cap(node.capacity);
    return {
      id: node.id,
      status: node.status === "NODE_STATUS_AVAILABLE" ? "online" : "offline",
      location: node.name,
      capacityUsed: Math.max(total - cap(node.available), 0),
      capacityTotal: total,
      partnerHost: "",
      lastHeartbeatAt: "",
      uptimePct: 0,
      parcelsToday: 0,
      network: "",
    };
  },
  getCourierDetail: async () => {
    throw new Error("courier position detail is not supported by the API yet");
  },
  getAuditLog: async () => {
    const res = await apiClient.get("v1/admin/audit-events", {searchParams: {pageSize: 50}}).json<{activity: ApiActivity[]}>();
    return res.activity.map((a) => ({
      id: a.id,
      tone: "success" as const,
      title: a.action,
      detail: `${a.actorRole || "system"} · ${a.targetId}`,
      at: a.createdAt,
    }));
  },
};
