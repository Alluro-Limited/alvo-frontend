import {useState} from "react";
import {useRouter} from "@tanstack/react-router";
import {ArrowLeft} from "lucide-react";
import gearIconUrl from "@/assets/loading-gear.svg";
import {NotifChips, type NotifFilter} from "@/components/notifications/notif-chips";
import {NotifEmpty} from "@/components/notifications/notif-empty";
import {NotifFeed} from "@/components/notifications/notif-feed";
import type {NotificationGroup} from "@/types/notification-types";
import {useNotificationsQuery} from "@/queries/use-home-queries";
import {m} from "@/paraglide/messages";

function filterGroups(groups: NotificationGroup[], filter: NotifFilter) {
  if (filter === "all") return groups;
  const out: NotificationGroup[] = [];
  for (const g of groups) {
    const items = g.items.filter((n) => n.kind === filter);
    if (items.length > 0) out.push({...g, items});
  }
  return out;
}

/** Notifications: back + settings header, filter chips, and the day-grouped feed. */
export function NotificationsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<NotifFilter>("all");
  const query = useNotificationsQuery();
  const groups = filterGroups(query.data ?? [], filter);

  return (
    <main className="flex h-dvh w-full flex-col gap-6 overflow-hidden bg-white px-6 pt-[60px]">
      <div className="flex w-full items-center justify-between">
        <button
          type="button"
          onClick={() => router.history.back()}
          aria-label={m["nt.back"]()}
          className="flex size-8 items-center justify-center rounded-full bg-[#f2f2f2]"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </button>
        <span className="flex size-8 items-center justify-center rounded-[4px] bg-[#f9f9f9]">
          <img src={gearIconUrl} alt="" aria-hidden="true" className="size-5" />
        </span>
      </div>
      <h1 className="text-[32px] font-bold leading-[1.1] tracking-[-0.64px] text-foreground">{m["nt.title"]()}</h1>
      <NotifChips value={filter} onChange={setFilter} />
      {query.isLoading ? (
        <div className="flex flex-1 flex-col gap-4" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-[8px] bg-grey-100" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <NotifEmpty />
      ) : (
        <div className="flex-1 overflow-y-auto pb-8">
          <NotifFeed groups={groups} />
        </div>
      )}
    </main>
  );
}
