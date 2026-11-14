import {apiClient} from "@/services/api-client";
import {fetchPage} from "@/services/paged";
import type {AlertSeverity, DashboardService, NodeDetail, OverviewAlert, OverviewMapNode} from "@/types/dashboard-types";

interface ApiOverview {
  parcelsToday?: string;
  inTransit?: string;
  deliveredToday?: string;
  deliveryRate?: {onTime?: string; late?: string; failed?: string};
  activeNodes?: string;
  registeredNodes?: string;
  onlineCouriers?: string;
  slaAtRisk?: string;
}

interface ApiAlert {
  kind?: string;
  targetId?: string;
  targetRef?: string;
  raisedAt?: string;
  parcelsAffected?: string;
}

interface ApiActivity {
  id?: string;
  actorRole?: string;
  action?: string;
  targetType?: string;
  targetId?: string;
  createdAt?: string;
}

interface ApiAuditEvent {
  id?: string;
  actorRole?: string;
  action?: string;
  targetType?: string;
  targetId?: string;
  reasonCode?: string;
  notes?: string;
  createdAt?: string;
}

interface ApiAdminNode {
  id?: string;
  code?: string;
  lat?: number;
  lng?: number;
  status?: string;
  liveParcels?: string;
  capacity?: {small?: number; medium?: number; large?: number};
  details?: {name?: string; partnerName?: string; region?: string; zone?: string; address?: string};
}

const cap = (c?: {small?: number; medium?: number; large?: number}) => (c ? (c.small ?? 0) + (c.medium ?? 0) + (c.large ?? 0) : 0);

const ALERT_TONE: Record<string, AlertSeverity> = {
  ALERT_KIND_NODE_OFFLINE: "error",
  ALERT_KIND_NODE_FULL: "error",
  ALERT_KIND_PARCEL_SLA_AT_RISK: "warning",
  ALERT_KIND_FLAG_OPEN: "warning",
};

const toAlert = (a: ApiAlert): OverviewAlert => ({
  id: a.targetId ?? "",
  severity: ALERT_TONE[a.kind ?? ""] ?? "warning",
  title: a.targetRef ?? "",
  description: (a.kind ?? "").replace("ALERT_KIND_", "").replaceAll("_", " ").toLowerCase(),
  at: a.raisedAt ?? "",
});

const nodeStatus = (status?: string) => (status === "ADMIN_NODE_STATUS_AVAILABLE" ? "online" : "offline");

const num = (v?: string | number) => Number(v ?? 0);

const toMapNode = (n: ApiAdminNode): OverviewMapNode => ({
  id: n.id ?? "",
  status: nodeStatus(n.status),
  position: [n.lng ?? 0, n.lat ?? 0],
});

const toKpis = (o: ApiOverview, nodesTotal: number, nodesOnline: number) => ({
  activeParcels: num(o.inTransit),
  nodesOnline,
  nodesTotal,
  nodesUptimePct: nodesTotal ? Math.round((nodesOnline / nodesTotal) * 100) : undefined,
  couriersActive: num(o.onlineCouriers),
  couriersRegistered: num(o.onlineCouriers),
  revenueToday: 0,
});

const toDeliveryRate = (o: ApiOverview) => ({
  today: num(o.deliveredToday),
  onTime: num(o.deliveryRate?.onTime),
  late: num(o.deliveryRate?.late),
  failed: num(o.deliveryRate?.failed),
});

const activityRow = (a: {id?: string; actorRole?: string; action?: string; targetId?: string; createdAt?: string}) => ({
  id: a.id ?? "",
  tone: "success" as const,
  title: a.action ?? "",
  detail: `${a.actorRole || "system"} · ${a.targetId ?? ""}`,
  at: a.createdAt ?? "",
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
      apiClient.get("v1/admin/overview/alerts", {searchParams: {page_size: 10}}).json<{alerts: ApiAlert[]}>(),
      apiClient.get("v1/admin/overview/activity", {searchParams: {page_size: 10}}).json<{activity: ApiActivity[]}>(),
      apiClient.get("v1/admin/nodes").json<{nodes: ApiAdminNode[]}>(),
    ]);
    const nodesTotal = num(overview.registeredNodes);
    const nodesOnline = num(overview.activeNodes);
    return {
      firstRun: false,
      kpis: toKpis(overview, nodesTotal, nodesOnline),
      deliveryRate: toDeliveryRate(overview),
      map: {nodes: (nodes.nodes ?? []).map(toMapNode), couriers: [], route: []},
      alerts: (alerts.alerts ?? []).map(toAlert),
      activity: (activity.activity ?? []).map(activityRow),
    };
  },
  getNodeDetail: async (id): Promise<NodeDetail> => {
    const res = await apiClient.get(`v1/admin/nodes/${id}`).json<{node?: ApiAdminNode}>();
    const node = res.node ?? {};
    return {
      id: node.id ?? id,
      status: nodeStatus(node.status),
      location: node.details?.name ?? node.code ?? "",
      capacityUsed: Number(node.liveParcels ?? 0),
      capacityTotal: cap(node.capacity),
      partnerHost: node.details?.partnerName ?? "",
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
    const page = await fetchPage<ApiAuditEvent>("audit-events", 1, (pageToken) =>
      apiClient
        .get("v1/admin/audit-events", {searchParams: {page_size: 50, ...(pageToken ? {page_token: pageToken} : {})}})
        .json<{events?: ApiAuditEvent[]; nextPageToken?: string; total?: string}>()
        .then((res) => ({items: res.events ?? [], nextPageToken: res.nextPageToken, total: Number(res.total ?? 0)}))
    );
    return page.items.map(activityRow);
  },
};
