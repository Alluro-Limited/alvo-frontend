import {ActivityCard} from "./activity-card";
import type {ActivityFilter, ActivityItem} from "@/types/activity-types";
import type {SimpleMessage} from "@/lib/i18n";
import {m} from "@/paraglide/messages";

const ACTIVE = new Set(["pending", "booked", "dropped", "enroute", "delayed"]);
const COMPLETED = new Set(["complete", "collected"]);

function matches(item: ActivityItem, filter: ActivityFilter): boolean {
  if (filter === "all") return true;
  if (filter === "active") return ACTIVE.has(item.status);
  if (filter === "completed") return COMPLETED.has(item.status);
  return !ACTIVE.has(item.status) && !COMPLETED.has(item.status);
}

function groupByDay(items: ActivityItem[]): [string, ActivityItem[]][] {
  const groups = new Map<string, ActivityItem[]>();
  for (const item of items) {
    const list = groups.get(item.day) ?? [];
    list.push(item);
    groups.set(item.day, list);
  }
  return [...groups];
}

const DAY_LABELS: Record<string, SimpleMessage> = {today: "act.day_today", yesterday: "act.day_yesterday"};

interface ActivityFeedProps {
  items: ActivityItem[];
  filter: ActivityFilter;
  /** Opens the locker-upgrade sheet for a `pending` item. */
  onUpgrade: (item: ActivityItem) => void;
}

/** The filter-aware, day-grouped activity feed with — Day — dividers. */
export function ActivityFeed({items, filter, onUpgrade}: ActivityFeedProps) {
  const visible = filter === "all" ? items : items.filter((i) => matches(i, filter));
  if (visible.length === 0) {
    return <p className="pt-10 text-center text-[14px] leading-[1.4] text-grey-500">{m["act.empty"]()}</p>;
  }
  return (
    <div className="flex w-full flex-col gap-4">
      {groupByDay(visible).map(([day, group]) => (
        <section key={day} className="flex w-full flex-col gap-4">
          <div className="flex w-full items-center gap-2">
            <span className="h-px flex-1 bg-grey-300" aria-hidden="true" />
            <span className="whitespace-nowrap text-[10px] leading-[1.4] tracking-[0.1px] text-grey-600">
              {DAY_LABELS[day] ? m[DAY_LABELS[day]]() : day}
            </span>
            <span className="h-px flex-1 bg-grey-300" aria-hidden="true" />
          </div>
          <div className="flex w-full flex-col">
            {group.map((item) => (
              <ActivityCard key={item.id} item={item} onUpgrade={onUpgrade} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
