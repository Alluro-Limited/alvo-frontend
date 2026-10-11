export type ShipmentSize = "S" | "M" | "B";
export type ShipmentPriority = "standard" | "express";
export type ShipmentStatus = "in_transit" | "delayed" | "failed" | "delivered";

export interface RecentShipment {
  id: string;
  recipient: string;
  phone: string;
  destination: string;
  size: ShipmentSize;
  priority: ShipmentPriority;
  status: ShipmentStatus;
}

export interface TopLocker {
  code: string;
  area: string;
  deliveries: number;
}

/** Monetary values are whole naira (no kobo) for display. */
export interface DashboardStats {
  totalBatches: number;
  activeBatches: number;
  completeBatches: number;
  draftBatches: number;
  totalShipments: number;
  topLocker: TopLocker | null;
  totalSpend: number;
  avgPerShipment: number;
  activeShipments: number;
  activeShipmentBatches: number;
  deliveredLast30Days: number;
  pending: number;
  failed: number;
}

export interface DashboardOverview {
  firstName: string;
  walletBalance: number;
  stats: DashboardStats;
  recentShipments: RecentShipment[];
}

export type NotificationDayGroup = "today" | "yesterday" | "earlier";
export type NotificationIcon = "batch" | "package" | "wallet";

export interface AppNotification {
  id: string;
  icon: NotificationIcon;
  title: string;
  body: string;
  time: string;
  day: NotificationDayGroup;
  read: boolean;
}

export interface DashboardService {
  getOverview: () => Promise<DashboardOverview>;
  getNotifications: () => Promise<AppNotification[]>;
  markAllNotificationsRead: () => Promise<void>;
}
