import {cn} from "cnfast";
import {formatRelativeTime} from "@/lib/format";
import type {OverviewActivityItem} from "@/types/dashboard-types";

/** One row of the Recent Activity feed: status dot, event title/detail, relative time. */
export function ActivityItemRow({item}: {item: OverviewActivityItem}) {
  return (
    <li className="flex h-[54px] items-start justify-between rounded-lg py-2">
      <div className="flex items-start gap-2">
        <div className="flex items-center py-[3px]">
          <span
            className={cn("size-3 rounded-full", item.tone === "success" ? "bg-status-success" : "bg-status-fail")}
            aria-hidden="true"
          />
        </div>
        <div className="flex flex-col justify-center text-xs leading-[1.4] tracking-[0.12px]">
          <p className="font-medium text-grey-600">{item.title}</p>
          <p className="text-grey-500">{item.detail}</p>
        </div>
      </div>
      <p className="text-right text-[10px] leading-[1.4] tracking-[0.1px] text-grey-500">{formatRelativeTime(item.at)}</p>
    </li>
  );
}
