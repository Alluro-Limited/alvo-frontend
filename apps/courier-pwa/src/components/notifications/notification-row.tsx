import {BadgeCheck, HandCoins, Package} from "lucide-react";
import type {CourierNotification, NotificationIcon} from "@/types/deliveries-types";
import {cn} from "cnfast";

const ICONS: Record<NotificationIcon, {icon: typeof Package; tile: string; tint: string}> = {
  completed: {icon: BadgeCheck, tile: "bg-primary-50", tint: "text-primary-500"},
  assigned: {icon: Package, tile: "bg-primary-50", tint: "text-primary-500"},
  speed: {icon: Package, tile: "bg-[#fdf4e5]", tint: "text-[#d99a2b]"},
  earning: {icon: HandCoins, tile: "bg-primary-50", tint: "text-primary-500"},
};

/** One feed row: kind icon, title + unread dot + timestamp, then the grey body copy. */
export function NotificationRow({notification}: {notification: CourierNotification}) {
  const {icon: Icon, tile, tint} = ICONS[notification.icon];

  return (
    <li className="flex gap-3 border-b border-grey-100 py-4 last:border-0">
      <span className={cn("grid size-9 shrink-0 place-items-center rounded-[10px]", tile)}>
        <Icon className={cn("size-4.5", tint)} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-[14px] font-semibold">
            {notification.title}
            {notification.unread && (
              <span className="ml-1.5 inline-block size-1.5 rounded-full bg-success-500 align-middle" aria-hidden="true" />
            )}
          </p>
          <p className="shrink-0 text-[11px] text-grey-500">{notification.time}</p>
        </div>
        <p className="mt-1 text-[12px] leading-[18px] text-grey-500">{notification.body}</p>
      </div>
    </li>
  );
}
