/** KPI strip across the top of the overview. */
export interface OverviewKpis {
  activeParcels: number;
  /** Delta vs yesterday, e.g. 2.3 → the green "+2.3%" badge. */
  parcelsDeltaPct?: number;
  nodesOnline: number;
  nodesTotal: number;
  /** Share of nodes online, e.g. 90 → the green "90%" badge. */
  nodesUptimePct?: number;
  couriersActive: number;
  couriersRegistered: number;
  /** Offline couriers → the amber "N offline" badge. */
  couriersOffline?: number;
  /** Today's revenue in naira. */
  revenueToday: number;
  revenueDeltaPct?: number;
}

/** Delivery-rate card figures. */
export interface DeliveryRateSummary {
  /** Headline figure in the header badge ("X% today"). */
  today: number;
  onTime: number;
  late: number;
  failed: number;
}

/** Counts behind the status chips floating on the live map — derived from the marker list. */
export interface MapStatusCounts {
  online: number;
  offline: number;
  warning: number;
}

/** A node marker on the live map. Position is [longitude, latitude]. */
export interface OverviewMapNode {
  id: string;
  status: "online" | "offline" | "warning";
  position: [number, number];
}

/** A courier marker on the live map. Position is [longitude, latitude]. */
export interface OverviewMapCourier {
  id: string;
  position: [number, number];
}

/** The Live Operation panel's data: markers and the active delivery route. */
export interface OverviewMap {
  nodes: OverviewMapNode[];
  couriers: OverviewMapCourier[];
  /** Ordered [lng, lat] waypoints drawn as the courier's route. */
  route: [number, number][];
  /** Waypoints already covered — rendered as the darker completed leg. */
  routeCompleted?: [number, number][];
}

export type AlertSeverity = "success" | "warning" | "error";

export interface OverviewAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  /** ISO timestamp. */
  at: string;
}

export interface OverviewActivityItem {
  id: string;
  tone: "success" | "fail";
  title: string;
  detail: string;
  /** ISO timestamp, rendered as a relative "Xm ago". */
  at: string;
}

/** Overview payload for the dashboard home. */
export interface DashboardOverview {
  /** True for a freshly onboarded admin — the welcome modal sits over the dashboard. */
  firstRun: boolean;
  kpis: OverviewKpis;
  deliveryRate: DeliveryRateSummary;
  map: OverviewMap;
  alerts: OverviewAlert[];
  activity: OverviewActivityItem[];
}

/** Detail behind a node's popover, fetched on marker click. */
export interface NodeDetail {
  id: string;
  status: OverviewMapNode["status"];
  location: string;
  capacityUsed: number;
  capacityTotal: number;
  partnerHost: string;
  /** ISO timestamp of the node's last heartbeat. */
  lastHeartbeatAt: string;
  uptimePct: number;
  parcelsToday: number;
  network: string;
}

export type CourierStatus = "enroute" | "idle" | "offline";

/** Detail behind a courier's popover, fetched on marker click. */
export interface CourierDetail {
  id: string;
  name: string;
  /** Optional photo — initials render when absent. */
  avatarUrl?: string;
  status: CourierStatus;
  deliveriesDone: number;
  deliveriesTotal: number;
  lastLocation: string;
  /** ISO timestamp, when the courier went offline. */
  offlineSinceAt?: string;
  rating: number;
  pickupNode: string;
  dropoffNode: string;
  deliveryType: string;
  /** ISO timestamp for the current delivery's ETA. */
  etaAt: string;
}

export interface DashboardService {
  getOverview: () => Promise<DashboardOverview>;
  getNodeDetail: (id: string) => Promise<NodeDetail>;
  getCourierDetail: (id: string) => Promise<CourierDetail>;
}
