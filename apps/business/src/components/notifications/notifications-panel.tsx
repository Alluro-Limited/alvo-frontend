import {PopoverClose} from "@alvo/ui";
import {cn} from "cnfast";
import {useMarkAllNotificationsRead} from "@/queries/use-dashboard-queries";
import {m} from "@/paraglide/messages";
import type {AppNotification} from "@/types/dashboard-types";
import notifCloseUrl from "@/assets/notif-close.svg";
import notifTickUrl from "@/assets/notif-tick.svg";
import {NotificationsBody} from "./notifications-body";

interface NotificationsPanelProps {
  notifications: AppNotification[];
  isLoading: boolean;
}

/** The 400px dropdown under the bell: header, grouped rows or empty state, and a mark-all-read footer. */
export function NotificationsPanel({notifications, isLoading}: NotificationsPanelProps) {
  const markAllRead = useMarkAllNotificationsRead();
  const hasUnread = notifications.some((notification) => !notification.read);

  return (
    <div className="flex w-[400px] flex-col overflow-clip rounded-xl bg-white">
      <div className="flex items-center justify-between overflow-clip border-b-[0.75px] border-grey-300 px-6 py-4">
        <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{m["notifications.title"]()}</p>
        <PopoverClose aria-label={m["notifications.close"]()} className="flex size-4 items-center justify-center text-black">
          <img src={notifCloseUrl} alt="" aria-hidden="true" className="size-4" />
        </PopoverClose>
      </div>
      <div className="max-h-[440px] overflow-y-auto">
        <NotificationsBody notifications={notifications} isLoading={isLoading} />
      </div>
      <div className="border-t border-grey-300 p-6">
        <button
          type="button"
          onClick={() => markAllRead.mutate()}
          disabled={!hasUnread || markAllRead.isPending}
          className={cn(
            "flex w-full cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm leading-[1.4] font-medium tracking-[0.28px] text-primary-800 hover:bg-primary-800/5",
            (!hasUnread || markAllRead.isPending) && "cursor-default opacity-40 hover:bg-transparent"
          )}
        >
          <img src={notifTickUrl} alt="" aria-hidden="true" className="size-4" />
          {m["notifications.mark_all_read"]()}
        </button>
      </div>
    </div>
  );
}
