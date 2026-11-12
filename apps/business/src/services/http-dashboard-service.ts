import {formatDateTime} from "@/lib/datetime";
import {koboToNaira} from "@/lib/money";
import {apiClient} from "@/services/api-client";
import {getOwner, getSme} from "@/services/session";
import type {
  ApiGetBatchResponse,
  ApiGetSmeWalletResponse,
  ApiListBatchesResponse,
  ApiListNotificationsResponse,
  ApiNotification,
  ApiShipment,
} from "@/types/api-types";
import type {
  AppNotification,
  DashboardOverview,
  DashboardService,
  NotificationDayGroup,
  NotificationIcon,
  RecentShipment,
  ShipmentStatus,
} from "@/types/dashboard-types";

const SHIPMENT_STATUS: Record<string, ShipmentStatus> = {
  PARCEL_STATE_CREATED: "in_transit",
  PARCEL_STATE_PAID: "in_transit",
  PARCEL_STATE_CODE_ISSUED: "in_transit",
  PARCEL_STATE_AT_ORIGIN: "in_transit",
  PARCEL_STATE_IN_TRANSIT: "in_transit",
  PARCEL_STATE_AT_DEST: "in_transit",
  PARCEL_STATE_COLLECTED: "delivered",
  PARCEL_STATE_EXPIRED: "failed",
  PARCEL_STATE_CANCELLED: "failed",
  PARCEL_STATE_RETURN_PENDING: "failed",
  PARCEL_STATE_RETURNED: "failed",
};

const ICON: Record<string, NotificationIcon> = {
  NOTIFICATION_CATEGORY_DELIVERIES: "package",
  NOTIFICATION_CATEGORY_PAYMENT: "wallet",
  NOTIFICATION_CATEGORY_SYSTEM: "batch",
};

const dayGroup = (iso: string, now = new Date()): NotificationDayGroup => {
  const d = new Date(iso);
  const y = new Date(now);
  y.setDate(y.getDate() - 1);
  const same = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  return same(d, now) ? "today" : same(d, y) ? "yesterday" : "earlier";
};

const toNotification = (n: ApiNotification): AppNotification => ({
  id: n.id,
  icon: ICON[n.category] ?? "package",
  title: n.title,
  body: n.body,
  time: formatDateTime(n.createdAt),
  day: dayGroup(n.createdAt),
  read: Boolean(n.readAt),
});

const toRecent = (s: ApiShipment): RecentShipment => ({
  id: s.trackingNo,
  recipient: s.recipientName ?? s.recipientPhone,
  phone: s.recipientPhone,
  destination: "",
  size: "S",
  priority: "standard",
  status: SHIPMENT_STATUS[s.state] ?? "in_transit",
});

/**
 * Dashboard composed from `v1/sme/batches`, `v1/sme/wallet` and `v1/notifications` — there
 * is no dashboard endpoint. Stats come from the batch list; the recent shipments panel
 * reads the newest batch's shipments; delivered/pending/failed need a stats API.
 */
export const httpDashboardService: DashboardService = {
  getOverview: async (): Promise<DashboardOverview> => {
    const [batchesRes, walletRes] = await Promise.all([
      apiClient.get("v1/sme/batches", {searchParams: {limit: 100}}).json<ApiListBatchesResponse>(),
      apiClient
        .get("v1/sme/wallet")
        .json<ApiGetSmeWalletResponse>()
        .catch(() => null),
    ]);
    const batches = batchesRes.batches;
    const shipments = batches.reduce((sum, b) => sum + b.totalParcels, 0);
    const spend = batches.reduce((sum, b) => sum + koboToNaira(b.totalPriceKobo), 0);
    const newest = batches[0];
    const recent = newest
      ? await apiClient
          .get(`v1/sme/batches/${newest.id}`)
          .json<ApiGetBatchResponse>()
          .then((r) => r.shipments.slice(0, 5).map(toRecent))
          .catch(() => [])
      : [];
    return {
      firstName: getOwner()?.firstName ?? (getSme()?.businessName ?? "").split(" ")[0] ?? "",
      walletBalance: koboToNaira(walletRes?.wallet.balanceKobo),
      stats: {
        totalBatches: batches.length,
        activeBatches: batches.filter((b) => !b.status.includes("COMPLETE") && !b.status.includes("DRAFT")).length,
        completeBatches: batches.filter((b) => b.status.includes("COMPLETE")).length,
        draftBatches: batches.filter((b) => b.status.includes("DRAFT")).length,
        totalShipments: shipments,
        topLocker: null,
        totalSpend: spend,
        avgPerShipment: shipments ? Math.round(spend / shipments) : 0,
        activeShipments: 0,
        activeShipmentBatches: 0,
        deliveredLast30Days: 0,
        pending: 0,
        failed: 0,
      },
      recentShipments: recent,
    };
  },
  getNotifications: async () => {
    const res = await apiClient.get("v1/notifications", {searchParams: {limit: 50}}).json<ApiListNotificationsResponse>();
    return res.notifications.map(toNotification);
  },
  markAllNotificationsRead: async () => {
    await apiClient.post("v1/notifications/read-all", {json: {}});
  },
};
