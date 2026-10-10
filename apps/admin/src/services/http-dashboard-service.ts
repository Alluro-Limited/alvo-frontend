import * as v from "valibot";
import {apiClient} from "@/services/api-client";
import type {DashboardService} from "@/types/dashboard-types";

const LngLatSchema = v.tuple([v.number(), v.number()]);

const OverviewResponseSchema = v.object({
  firstRun: v.boolean(),
  kpis: v.object({
    activeParcels: v.number(),
    parcelsDeltaPct: v.optional(v.number()),
    nodesOnline: v.number(),
    nodesTotal: v.number(),
    nodesUptimePct: v.optional(v.number()),
    couriersActive: v.number(),
    couriersRegistered: v.number(),
    couriersOffline: v.optional(v.number()),
    revenueToday: v.number(),
    revenueDeltaPct: v.optional(v.number()),
  }),
  deliveryRate: v.object({today: v.number(), onTime: v.number(), late: v.number(), failed: v.number()}),
  map: v.object({
    nodes: v.array(v.object({id: v.string(), status: v.picklist(["online", "offline", "warning"]), position: LngLatSchema})),
    couriers: v.array(v.object({id: v.string(), position: LngLatSchema})),
    route: v.array(LngLatSchema),
    routeCompleted: v.optional(v.array(LngLatSchema)),
  }),
  alerts: v.array(
    v.object({
      id: v.string(),
      severity: v.picklist(["success", "warning", "error"]),
      title: v.string(),
      description: v.string(),
      at: v.string(),
    })
  ),
  activity: v.array(
    v.object({
      id: v.string(),
      tone: v.picklist(["success", "fail"]),
      title: v.string(),
      detail: v.string(),
      at: v.string(),
    })
  ),
});

const NodeDetailSchema = v.object({
  id: v.string(),
  status: v.picklist(["online", "offline", "warning"]),
  location: v.string(),
  capacityUsed: v.number(),
  capacityTotal: v.number(),
  partnerHost: v.string(),
  lastHeartbeatAt: v.string(),
  uptimePct: v.number(),
  parcelsToday: v.number(),
  network: v.string(),
});

const CourierDetailSchema = v.object({
  id: v.string(),
  name: v.string(),
  avatarUrl: v.optional(v.string()),
  status: v.picklist(["enroute", "idle", "offline"]),
  deliveriesDone: v.number(),
  deliveriesTotal: v.number(),
  lastLocation: v.string(),
  offlineSinceAt: v.optional(v.string()),
  rating: v.number(),
  pickupNode: v.string(),
  dropoffNode: v.string(),
  deliveryType: v.string(),
  etaAt: v.string(),
});

/** Dashboard over the real backend. The endpoint paths are placeholders until the API exists. */
export const httpDashboardService: DashboardService = {
  getOverview: async () => {
    const body = await apiClient.get("dashboard/overview").json();
    return v.parse(OverviewResponseSchema, body);
  },
  getNodeDetail: async (id) => {
    const body = await apiClient.get(`dashboard/nodes/${id}`).json();
    return v.parse(NodeDetailSchema, body);
  },
  getCourierDetail: async (id) => {
    const body = await apiClient.get(`dashboard/couriers/${id}`).json();
    return v.parse(CourierDetailSchema, body);
  },
};
