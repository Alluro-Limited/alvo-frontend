import {Popover, PopoverPopup, PopoverPortal, PopoverPositioner, PopoverTrigger} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import {useNotifications} from "@/queries/use-dashboard-queries";
import headerBellDotUrl from "@/assets/header-bell-dot.svg";
import headerBellUrl from "@/assets/header-bell.svg";
import {NotificationsPanel} from "./notifications-panel";

/** The grey header button that opens the notifications dropdown; a red dot marks unread items. */
export function NotificationsBell() {
  const {data: notifications, isLoading} = useNotifications();
  const hasUnread = (notifications ?? []).some((notification) => !notification.read);

  return (
    <Popover>
      <PopoverTrigger aria-label={m["notifications.title"]()} className="relative flex items-center rounded-lg bg-grey-100 p-2.5">
        <img src={headerBellUrl} alt="" aria-hidden="true" className="size-5" />
        {hasUnread && <img src={headerBellDotUrl} alt="" aria-hidden="true" className="absolute top-[11px] left-[19px] size-1.5" />}
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverPositioner side="bottom" align="end" sideOffset={8}>
          <PopoverPopup className="shadow-[0px_41px_17px_0px_rgba(0,0,0,0.01),0px_23px_14px_0px_rgba(0,0,0,0.03),0px_10px_10px_0px_rgba(0,0,0,0.05),0px_3px_6px_0px_rgba(0,0,0,0.06)]">
            <NotificationsPanel notifications={notifications ?? []} isLoading={isLoading} />
          </PopoverPopup>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
  );
}
