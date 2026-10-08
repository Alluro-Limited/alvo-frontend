import {m} from "@/paraglide/messages";
import type {AdminMetrics} from "@/types/admins-types";

const CARDS: {key: keyof AdminMetrics; label: () => string; dot: string}[] = [
  {key: "total", label: m["admins.metric_total"], dot: "bg-primary-500"},
  {key: "active", label: m["admins.metric_active"], dot: "bg-status-success"},
  {key: "suspended", label: m["admins.metric_suspended"], dot: "bg-status-fail"},
  {key: "invited", label: m["admins.metric_invited"], dot: "bg-status-delayed"},
];

/** The four metric cards above the table — Total, Active, Suspended, Pending Invites. */
export function AdminsMetrics({metrics}: {metrics: AdminMetrics}) {
  return (
    <div className="grid grid-cols-4 gap-4" data-testid="admins-metrics">
      {CARDS.map(({key, label, dot}) => (
        <div key={key} className="rounded-2xl border border-grey-200 bg-white p-4">
          <span className={`block size-6 rounded-full ${dot}`} aria-hidden="true" />
          <p className="pt-6 text-sm leading-[1.4] tracking-[0.14px] text-grey-600">{label()}</p>
          <p className="pt-1 text-[24px] leading-[1.2] font-bold text-black">{metrics[key].toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
