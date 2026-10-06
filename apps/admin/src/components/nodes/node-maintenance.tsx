import {m} from "@/paraglide/messages";
import type {NodeMaintenanceEvent} from "@/types/nodes-types";
import {formatEventDate} from "./nodes-format";

const STATUS_LABEL: Record<NodeMaintenanceEvent["status"], () => string> = {
  completed: m["nodes.maintenance_completed"],
  scheduled: m["nodes.maintenance_scheduled"],
  in_progress: m["nodes.maintenance_in_progress"],
};

const STATUS_CLASS: Record<NodeMaintenanceEvent["status"], string> = {
  completed: "bg-status-success-subtle text-status-success-dark",
  scheduled: "bg-status-warning-subtle text-status-warning-dark",
  in_progress: "bg-status-delayed-subtle text-status-delayed-dark",
};

/** The maintenance history card — service events ordered by the backend payload. */
export function NodeMaintenance({events}: {events: NodeMaintenanceEvent[]}) {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-grey-200 bg-white p-6" aria-labelledby="node-maintenance-title">
      <h2 id="node-maintenance-title" className="text-base leading-[1.4] font-medium tracking-[0.16px] text-black">
        {m["nodes.maintenance_title"]()}
      </h2>
      {events.length === 0 ? (
        <div className="flex flex-col items-center gap-1 py-8 text-center">
          <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{m["nodes.maintenance_empty_title"]()}</p>
          <p className="max-w-[360px] text-xs leading-[1.4] tracking-[0.12px] text-grey-500">
            {m["nodes.maintenance_empty_description"]()}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col">
          {events.map((event) => (
            <li key={event.id} className="flex items-center justify-between gap-3 border-b border-grey-100 py-3 last:border-b-0">
              <div className="flex min-w-0 flex-col">
                <p className="truncate text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{event.title}</p>
                <p className="truncate text-xs leading-[1.4] tracking-[0.12px] text-grey-500">
                  {m["nodes.maintenance_meta"]({date: formatEventDate(event.at), vendor: event.vendor})}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-md px-2 py-1 text-xs leading-[1.4] font-medium tracking-[0.12px] ${STATUS_CLASS[event.status]}`}
              >
                {STATUS_LABEL[event.status]()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
