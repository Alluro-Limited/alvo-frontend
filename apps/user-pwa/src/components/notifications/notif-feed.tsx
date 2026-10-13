import {NotifIcon} from "./notif-icon";
import type {NotificationGroup} from "@/types/notification-types";

/** Grouped notification rows with — Day — dividers. */
export function NotifFeed({groups}: {groups: NotificationGroup[]}) {
  return (
    <div className="flex w-full flex-col gap-4">
      {groups.map((group) => (
        <section key={group.label} className="flex w-full flex-col gap-4">
          <div className="flex w-full items-center gap-2">
            <span className="h-px flex-1 bg-grey-300" aria-hidden="true" />
            <span className="text-[10px] leading-[1.4] tracking-[0.1px] text-grey-600 whitespace-nowrap">{group.label}</span>
            <span className="h-px flex-1 bg-grey-300" aria-hidden="true" />
          </div>
          <ul className="flex w-full flex-col">
            {group.items.map((n) => (
              <li key={n.id} className="flex items-start gap-2 border-b-[0.5px] border-grey-300 px-2 py-4 last:border-b-0">
                <NotifIcon kind={n.kind} />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex w-full items-start justify-between gap-2">
                    <p className="text-[12px] font-medium leading-[1.4] tracking-[0.12px] text-black">{n.title}</p>
                    <span className="shrink-0 text-[10px] leading-[1.4] tracking-[0.1px] text-grey-500">{n.time}</span>
                  </div>
                  <p className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-600">{n.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
