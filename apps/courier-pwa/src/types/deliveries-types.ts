import type {CourierJob, JobKind} from "./home-types";

/** One finished delivery in the Completed Deliveries list. */
export interface CompletedDelivery {
  id: string;
  kind: JobKind;
  payout: number;
  originNode: string;
  destinationNode: string;
  packages: number;
  distanceKm: number;
  /** e.g. "20th Dec, 2025 · 9:45". */
  dateLabel: string;
}

export interface DeliveriesOverview {
  /** The in-flight delivery shown in the milestone slot — same shape as the home card. */
  active: CourierJob | null;
  completed: CompletedDelivery[];
}

export interface DeliveryAnalytics {
  allTimeJobs: number;
  todayJobs: number;
  allTimeEarnings: number;
  todayEarnings: number;
  /** Seven values Mon–Sun, normalized 0–100 bar heights. */
  weeklyJobs: number[];
}

export type NotificationCategory = "delivery" | "earning";
export type NotificationIcon = "completed" | "assigned" | "speed" | "earning";

export interface CourierNotification {
  id: string;
  category: NotificationCategory;
  icon: NotificationIcon;
  title: string;
  body: string;
  time: string;
  /** Group label for the divider rows, e.g. "Today", "Yesterday", "25/02/2026". */
  dayLabel: string;
  unread: boolean;
}

export interface DeliveriesService {
  getDeliveries: () => Promise<DeliveriesOverview>;
  getAnalytics: () => Promise<DeliveryAnalytics>;
}

export interface NotificationsService {
  getNotifications: () => Promise<CourierNotification[]>;
}
