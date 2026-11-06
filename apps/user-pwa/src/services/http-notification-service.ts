import {formatTime, sectionLabel} from "@/lib/datetime";
import {apiClient} from "@/services/api-client";
import type {ApiListNotificationsResponse, ApiNotification} from "@/types/api-types";
import type {NotificationGroup, NotificationKind, UserNotification, UserNotificationService} from "@/types/notification-types";

const CATEGORY: Record<string, NotificationKind> = {
  NOTIFICATION_CATEGORY_DELIVERIES: "delivery",
  NOTIFICATION_CATEGORY_PAYMENT: "payment",
  NOTIFICATION_CATEGORY_SYSTEM: "announcement",
};

const toNotification = (n: ApiNotification): UserNotification => ({
  id: n.id,
  kind: CATEGORY[n.category] ?? "announcement",
  title: n.title,
  body: n.body,
  time: formatTime(n.createdAt),
});

/**
 * Notifications against `v1/notifications` — fetched newest-first and grouped into
 * Today/Yesterday/date sections here. `read_at`, the unread-count badge, and the
 * mark-read endpoints exist but the screens don't expose read state yet.
 */
export const httpNotificationService: UserNotificationService = {
  getNotifications: async () => {
    const groups: NotificationGroup[] = [];
    let cursor = "";
    do {
      const res = await apiClient.get("v1/notifications", {searchParams: {limit: 50, cursor}}).json<ApiListNotificationsResponse>();
      for (const item of res.notifications) {
        const label = sectionLabel(item.createdAt);
        const last = groups[groups.length - 1];
        if (last?.label === label) last.items.push(toNotification(item));
        else groups.push({label, items: [toNotification(item)]});
      }
      cursor = res.nextCursor;
    } while (cursor);
    return groups;
  },
  getUnreadCount: async () => {
    const res = await apiClient.get("v1/notifications/unread-count").json<{count?: string | number; unreadCount?: string | number}>();
    return Number(res.unreadCount ?? res.count ?? 0);
  },
  markRead: async (id) => {
    await apiClient.post(`v1/notifications/${id}/read`);
  },
  markAllRead: async () => {
    await apiClient.post("v1/notifications/read-all");
  },
};
