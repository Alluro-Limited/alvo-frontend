import activityEmptyIcon from "@/assets/activity-empty-icon.svg";
import {m} from "@/paraglide/messages";
import type {OverviewActivityItem} from "@/types/dashboard-types";
import {ActivityItemRow} from "./activity-item";
import {EmptyPanelBody} from "./empty-panel-body";
import {ListCard} from "./list-card";

/** Recent-activity rail card: the live feed, or the "no activity yet" empty state. */
export function ActivityCard({items}: {items: OverviewActivityItem[]}) {
  return (
    <ListCard
      title={m["overview.activity_title"]()}
      emptyState={
        items.length === 0 ? (
          <EmptyPanelBody
            icon={<img src={activityEmptyIcon} alt="" className="w-12" />}
            title={m["overview.activity_empty_title"]()}
            description={m["overview.activity_empty_description"]()}
          />
        ) : undefined
      }
    >
      {items.map((item) => (
        <ActivityItemRow key={item.id} item={item} />
      ))}
    </ListCard>
  );
}
