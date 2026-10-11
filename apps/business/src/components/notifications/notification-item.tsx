import {cn} from "cnfast";
import type {AppNotification, NotificationIcon} from "@/types/dashboard-types";
import notifBatchUrl from "@/assets/notif-batch.svg";
import notifPackageUrl from "@/assets/notif-package.svg";
import notifUnreadDotUrl from "@/assets/notif-unread-dot.svg";
import notifWalletUrl from "@/assets/notif-wallet.svg";

const ICONS: Record<NotificationIcon, string> = {
  batch: notifBatchUrl,
  package: notifPackageUrl,
  wallet: notifWalletUrl,
};

/** One notification row: 24px icon, title + unread dot + time, grey body. Unread rows sit on cream. */
export function NotificationItem({notification}: {notification: AppNotification}) {
  return (
    <button
      type="button"
      aria-label={notification.title}
      className={cn(
        "flex w-full cursor-pointer items-start gap-2 border-b-[0.5px] border-grey-300 p-4 text-left last:border-b-0",
        !notification.read && "bg-cream"
      )}
    >
      <img src={ICONS[notification.icon]} alt="" aria-hidden="true" className="size-6 shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex w-full items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-1">
            <p className="text-xs leading-[1.4] font-medium tracking-[0.12px] text-black">{notification.title}</p>
            {!notification.read && <img src={notifUnreadDotUrl} alt="" aria-hidden="true" className="size-1.5 shrink-0" />}
          </div>
          <p className="w-[105px] shrink-0 text-right text-[10px] leading-[1.4] tracking-[0.1px] text-grey-600">{notification.time}</p>
        </div>
        <p className="w-full text-left text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{notification.body}</p>
      </div>
    </button>
  );
}
