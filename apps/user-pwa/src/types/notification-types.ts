/** Maps to the filter chips: Deliveries → delivery, Payment → payment; All shows everything. */
export type NotificationKind = "delivery" | "payment" | "announcement";

export interface UserNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  /** Display timestamp, e.g. "11:03 AM". */
  time: string;
}

export interface NotificationGroup {
  /** Divider label, e.g. "Today", "Yesterday", "17/12/2025". */
  label: string;
  items: UserNotification[];
}

export interface UserNotificationService {
  getNotifications: () => Promise<NotificationGroup[]>;
}
