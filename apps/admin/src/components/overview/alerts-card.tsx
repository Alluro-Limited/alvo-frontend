import {useState} from "react";
import alertsEmptyIcon from "@/assets/alerts-empty-icon.svg";
import {m} from "@/paraglide/messages";
import type {OverviewAlert} from "@/types/dashboard-types";
import {AlertRow} from "./alert-row";
import {EmptyPanelBody} from "./empty-panel-body";
import {ListCard} from "./list-card";

/** Alerts rail card: dismissible alert rows, or the "all systems operational" empty state. */
export function AlertsCard({alerts}: {alerts: OverviewAlert[]}) {
  // Dismissal is local until the backend can persist it.
  const [dismissed, setDismissed] = useState<ReadonlySet<string>>(new Set());
  const visible = alerts.filter((alert) => !dismissed.has(alert.id));

  return (
    <ListCard
      title={m["overview.alerts_title"]()}
      emptyState={
        visible.length === 0 ? (
          <EmptyPanelBody
            icon={<img src={alertsEmptyIcon} alt="" className="size-[45px]" />}
            title={m["overview.alerts_empty_title"]()}
            description={m["overview.alerts_empty_description"]()}
          />
        ) : undefined
      }
    >
      {visible.map((alert) => (
        <AlertRow key={alert.id} alert={alert} onDismiss={() => setDismissed((prev) => new Set(prev).add(alert.id))} />
      ))}
    </ListCard>
  );
}
