import {m} from "@/paraglide/messages";
import type {AppNotification, NotificationDayGroup} from "@/types/dashboard-types";
import notifBellOffUrl from "@/assets/notif-bell-off.svg";
import {NotificationItem} from "./notification-item";

const GROUP_LABELS: Record<NotificationDayGroup, () => string> = {
  today: m["notifications.group_today"],
  yesterday: m["notifications.group_yesterday"],
  earlier: m["notifications.group_earlier"],
};

function DayDivider({label}: {label: string}) {
  return (
    <div className="flex w-full items-center gap-2" aria-hidden="true">
      <div className="h-px flex-1 bg-grey-300" />
      <p className="text-[10px] leading-[1.4] tracking-[0.1px] whitespace-nowrap text-grey-600">{label}</p>
      <div className="h-px flex-1 bg-grey-300" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[369px] w-full flex-col items-center justify-center gap-3 p-6">
      <img src={notifBellOffUrl} alt="" aria-hidden="true" className="size-10" />
      <div className="flex w-full flex-col items-center gap-1 text-center">
        <p className="w-full text-base leading-[1.4] font-medium tracking-[0.16px] text-black">{m["notifications.empty_title"]()}</p>
        <p className="w-full text-xs leading-[1.4] tracking-[0.12px] text-grey-600">{m["notifications.empty_description"]()}</p>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex min-h-[200px] w-full flex-col gap-4 p-4" aria-hidden="true">
      {[0, 1, 2].map((index) => (
        <div key={index} className="flex items-start gap-2">
          <div className="size-6 shrink-0 animate-pulse rounded bg-grey-100" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-3 w-2/3 animate-pulse rounded bg-grey-100" />
            <div className="h-3 w-full animate-pulse rounded bg-grey-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function groupByDay(notifications: AppNotification[]) {
  const groups = new Map<NotificationDayGroup, AppNotification[]>();
  for (const notification of notifications) {
    const group = groups.get(notification.day) ?? [];
    group.push(notification);
    groups.set(notification.day, group);
  }
  return [...groups.entries()];
}

interface NotificationsBodyProps {
  notifications: AppNotification[];
  isLoading: boolean;
}

/** Skeleton rows while loading, the bell-off empty state, or rows grouped under day dividers. */
export function NotificationsBody({notifications, isLoading}: NotificationsBodyProps) {
  if (isLoading) return <LoadingSkeleton />;
  if (notifications.length === 0) return <EmptyState />;
  return (
    <>
      {groupByDay(notifications).map(([day, items]) => (
        <div key={day} className="flex w-full flex-col">
          <DayDivider label={GROUP_LABELS[day]()} />
          {items.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      ))}
    </>
  );
}
