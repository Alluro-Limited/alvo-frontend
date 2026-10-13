import {BellOff} from "lucide-react";
import type {CourierNotification} from "@/types/deliveries-types";
import {m} from "@/paraglide/messages";
import {NotificationRow} from "./notification-row";

/** Day-grouped feed: "— Today —" dividers, then each group's rows (or the empty state). */
export function NotificationFeed({groups}: {groups: [string, CourierNotification[]][]}) {
  if (groups.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-24 text-grey-400">
        <BellOff className="size-9" strokeWidth={1.5} aria-hidden="true" />
        <p className="mt-3 text-[13px] font-medium text-grey-500">{m["notif.empty"]()}</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {groups.map(([day, items]) => (
        <section key={day}>
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-grey-200" aria-hidden="true" />
            <p className="text-[11px] text-grey-500">{day}</p>
            <span className="h-px flex-1 bg-grey-200" aria-hidden="true" />
          </div>
          <ul>
            {items.map((n) => (
              <NotificationRow key={n.id} notification={n} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
