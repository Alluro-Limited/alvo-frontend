import type {CourierDetail, DashboardOverview, NodeDetail} from "@/types/dashboard-types";

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();
const secondsAgo = (seconds: number) => new Date(Date.now() - seconds * 1_000).toISOString();

/**
 * The just-onboarded overview: zeroed KPIs, empty delivery bars, no markers,
 * no alerts or activity. `status`/`deliveryRate.today` keep the Figma empty
 * frame's leftover figures (6/1/1 chips, "99.1% today") — a real API would
 * derive them from live data.
 */
export const EMPTY_OVERVIEW: Omit<DashboardOverview, "firstRun"> = {
  kpis: {activeParcels: 0, nodesOnline: 0, nodesTotal: 0, couriersActive: 0, couriersRegistered: 0, revenueToday: 0},
  deliveryRate: {today: 99.1, onTime: 0, late: 0, failed: 0},
  map: {nodes: [], couriers: [], route: []},
  alerts: [],
  activity: [],
};

/** An operating day on the network — mirrors Figma's populated overview frame. */
export const POPULATED_OVERVIEW: Omit<DashboardOverview, "firstRun"> = {
  kpis: {
    activeParcels: 847,
    parcelsDeltaPct: 2.3,
    nodesOnline: 142,
    nodesTotal: 158,
    nodesUptimePct: 90,
    couriersActive: 89,
    couriersRegistered: 114,
    couriersOffline: 25,
    revenueToday: 201892,
    revenueDeltaPct: 90,
  },
  deliveryRate: {today: 99.1, onTime: 94.2, late: 3.8, failed: 1.4},
  map: {
    nodes: [
      {id: "LK-108", status: "online", position: [3.4386, 6.4452]},
      {id: "LK-055", status: "online", position: [3.391, 6.5887]},
      {id: "LK-203", status: "online", position: [3.2962, 6.4591]},
      {id: "LK-091", status: "online", position: [3.2999, 6.5244]},
      {id: "LK-144", status: "online", position: [3.3506, 6.5804]},
      {id: "LK-044", status: "warning", position: [3.4291, 6.5446]},
      {id: "LK-077", status: "online", position: [3.4065, 6.4883]},
      {id: "LK-060", status: "offline", position: [3.3997, 6.548]},
      {id: "LK-022", status: "online", position: [3.3302, 6.4932]},
    ],
    couriers: [
      {id: "PRG-03", position: [3.3419, 6.5402]},
      {id: "PRG-11", position: [3.3694, 6.5208]},
    ],
    route: [
      [3.3071, 6.5174],
      [3.3334, 6.5363],
      [3.3506, 6.5485],
      [3.3604, 6.5554],
      [3.3669, 6.5598],
      [3.3983, 6.5826],
    ],
    routeCompleted: [
      [3.3071, 6.5174],
      [3.3334, 6.5363],
      [3.3506, 6.5485],
    ],
  },
  alerts: [
    {
      id: "al-lk044-resolved",
      severity: "success",
      title: "Node LK-044 offline",
      description: "Ikeja · 14 parcels affected",
      at: minutesAgo(2),
    },
    {id: "al-ikeja-offline", severity: "error", title: "Ikeja Node offline", description: "No heartbeat for 5+ minutes", at: minutesAgo(7)},
    {
      id: "al-ajadi-offline",
      severity: "error",
      title: "Ajadi Balogun",
      description: "Courier went offline mid-route, parcels undelivered",
      at: minutesAgo(15),
    },
    {
      id: "al-lk044-parcels",
      severity: "warning",
      title: "Node LK-044 offline",
      description: "Ikeja · 14 parcels affected",
      at: minutesAgo(21),
    },
    {
      id: "al-lk044-capacity",
      severity: "warning",
      title: "Node LK-044 offline",
      description: "Ikeja · 14 parcels affected",
      at: minutesAgo(26),
    },
  ],
  activity: [
    {id: "ac-in-transit", tone: "success", title: "In transit", detail: "PRV-88201 · Ikeja → Lekki", at: minutesAgo(1)},
    {id: "ac-delivered-yaba", tone: "success", title: "Delivered", detail: "PRV-88198 · Yaba node", at: minutesAgo(6)},
    {id: "ac-batch-stalled", tone: "fail", title: "Batch stalled", detail: "BLK-2291 · 340 parcels", at: minutesAgo(13)},
    {id: "ac-failed", tone: "fail", title: "Failed delivery", detail: "PRV-88190 · Courier offline", at: minutesAgo(32)},
    {id: "ac-delivered-garki", tone: "success", title: "Delivered", detail: "PRV-88187 · Garki, Abuja", at: minutesAgo(44)},
  ],
};

function nodeDetail(id: string, location: string, overrides: Partial<NodeDetail> = {}): NodeDetail {
  return {
    id,
    status: "online",
    location,
    capacityUsed: 18,
    capacityTotal: 28,
    partnerHost: "Total Energies",
    lastHeartbeatAt: secondsAgo(12),
    uptimePct: 99.4,
    parcelsToday: 32,
    network: "4G LTE",
    ...overrides,
  };
}

/** Popover detail per node id — the marker id is the lookup key, like `GET /nodes/:id`. */
export const NODE_DETAILS: Record<string, NodeDetail> = Object.fromEntries(
  [
    nodeDetail("LK-022", "Victoria Island, Lagos", {
      capacityUsed: 21,
      partnerHost: "Total Energies, VI",
      lastHeartbeatAt: secondsAgo(8),
      uptimePct: 99.8,
      parcelsToday: 47,
    }),
    nodeDetail("LK-108", "Apapa, Lagos", {capacityUsed: 9, parcelsToday: 21}),
    nodeDetail("LK-055", "Ikeja G.R.A, Lagos", {capacityUsed: 24, partnerHost: "Mobil, Ikeja"}),
    nodeDetail("LK-203", "Agege, Lagos", {capacityUsed: 14, parcelsToday: 19}),
    nodeDetail("LK-091", "Yaba, Lagos", {capacityUsed: 26, parcelsToday: 51}),
    nodeDetail("LK-144", "Ojota, Lagos", {capacityUsed: 11, parcelsToday: 26}),
    nodeDetail("LK-044", "Ikeja, Lagos", {
      status: "warning",
      capacityUsed: 27,
      lastHeartbeatAt: minutesAgo(6),
      uptimePct: 88.2,
      parcelsToday: 63,
      network: "3G",
    }),
    nodeDetail("LK-077", "Mile 2, Lagos", {capacityUsed: 7, parcelsToday: 14}),
    nodeDetail("LK-060", "Obalende, Lagos", {
      status: "offline",
      capacityUsed: 4,
      lastHeartbeatAt: minutesAgo(23),
      uptimePct: 71.5,
      parcelsToday: 8,
      network: "Offline",
    }),
  ].map((node) => [node.id, node])
);

function courierDetail(id: string, name: string, overrides: Partial<CourierDetail> = {}): CourierDetail {
  return {
    id,
    name,
    status: "enroute",
    deliveriesDone: 14,
    deliveriesTotal: 20,
    lastLocation: "Ikeja, Lagos",
    rating: 4.6,
    pickupNode: "Ikeja Node (LK-055)",
    dropoffNode: "Yaba Node (LK-091)",
    deliveryType: "Standard",
    etaAt: new Date(new Date().setHours(18, 15, 0, 0)).toISOString(),
    ...overrides,
  };
}

/** Popover detail per courier id — the marker id is the lookup key, like `GET /couriers/:id`. */
export const COURIER_DETAILS: Record<string, CourierDetail> = Object.fromEntries(
  [
    courierDetail("PRG-03", "Ajadi Johnson", {
      deliveriesDone: 21,
      deliveriesTotal: 28,
      lastLocation: "Surulere, Lagos",
      offlineSinceAt: new Date().toISOString(),
      rating: 4.8,
      pickupNode: "Lekki Node (LK-123)",
      dropoffNode: "Super Node (SN-001)",
      etaAt: new Date(new Date().setHours(17, 30, 0, 0)).toISOString(),
    }),
    courierDetail("PRG-11", "Tunde Bakare", {deliveriesDone: 9, deliveriesTotal: 16, rating: 4.4}),
  ].map((courier) => [courier.id, courier])
);
