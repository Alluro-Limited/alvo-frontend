import {useMemo, useState} from "react";
import {useNavigate} from "@tanstack/react-router";
import {ChipRow} from "@/components/app/chip-row";
import {NotificationFeed} from "@/components/notifications/notification-feed";
import {WizardHeader} from "@/components/sign-up/wizard-header";
import {m} from "@/paraglide/messages";
import {useNotificationsQuery} from "@/queries/use-notifications-queries";
import type {CourierNotification, NotificationCategory} from "@/types/deliveries-types";

type Filter = "all" | NotificationCategory;

/**
 * The bell-icon target: filter chips, Today/Yesterday/date dividers,
 * and the icon + unread-dot feed rows.
 */
export function NotificationsPage() {
  const navigate = useNavigate();
  const query = useNotificationsQuery();
  const [filter, setFilter] = useState<Filter>("all");

  const groups = useMemo(() => groupByDay(query.data ?? [], filter), [query.data, filter]);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-white px-6 pt-[max(24px,env(safe-area-inset-top))] pb-[max(24px,env(safe-area-inset-bottom))]">
      <WizardHeader step={0} onBack={() => void navigate({to: "/home"})} />
      <h1 className="mt-9 text-[28px] leading-[34px] font-bold tracking-[-0.02em]">{m["nav.notifications"]()}</h1>
      <div className="mt-5">
        <ChipRow
          value={filter}
          onChange={setFilter}
          options={[
            {value: "all", label: m["jobs.all"]()},
            {value: "delivery", label: m["notif.deliveries"]()},
            {value: "earning", label: m["notif.earning"]()},
          ]}
        />
      </div>
      {query.isPending ? (
        <div className="mt-6 flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-[12px] bg-grey-100" />
          ))}
        </div>
      ) : (
        <NotificationFeed groups={groups} />
      )}
    </main>
  );
}

/** Preserve the feed's day order — group consecutive labels, filter inside each group. */
function groupByDay(items: CourierNotification[], filter: Filter): [string, CourierNotification[]][] {
  const out: [string, CourierNotification[]][] = [];
  for (const item of items) {
    if (filter !== "all" && item.category !== filter) continue;
    const last = out.at(-1);
    if (last && last[0] === item.dayLabel) last[1].push(item);
    else out.push([item.dayLabel, [item]]);
  }
  return out;
}
