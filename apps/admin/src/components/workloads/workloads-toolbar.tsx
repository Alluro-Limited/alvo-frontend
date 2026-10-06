import {m} from "@/paraglide/messages";
import type {ParcelStatus, WorkloadFilterOptions} from "@/types/workloads-types";
import wlSearch from "@/assets/wl-search.svg";
import {FIELD_CLASSES, SelectShell} from "./select-shell";
import {STATUS_LABELS} from "./status-labels";

interface WorkloadsToolbarProps {
  query: string;
  status: ParcelStatus | "";
  nodeId: string;
  filterOptions: WorkloadFilterOptions;
  onQuery: (value: string) => void;
  onStatus: (value: ParcelStatus | "") => void;
  onNode: (value: string) => void;
}

/** Search field + status/node filter selects inside the rounded toolbar strip. */
export function WorkloadsToolbar({query, status, nodeId, filterOptions, onQuery, onStatus, onNode}: WorkloadsToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-white p-3">
      <div className="relative w-full max-w-[612px]">
        <img
          src={wlSearch}
          alt=""
          className="pointer-events-none absolute top-1/2 left-4 size-[22px] -translate-y-1/2"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder={m["workloads.search_placeholder"]()}
          aria-label={m["workloads.search_placeholder"]()}
          className={`${FIELD_CLASSES} pl-12 placeholder:text-grey-500`}
        />
      </div>
      <div className="flex w-[284px] shrink-0 items-center gap-2">
        <SelectShell aria-label={m["workloads.filter_status_aria"]()} value={status} onChange={(v) => onStatus(v as ParcelStatus | "")}>
          <option value="">{m["workloads.filter_all"]()}</option>
          {filterOptions.statuses.map((option) => (
            <option key={option} value={option}>
              {STATUS_LABELS[option]()}
            </option>
          ))}
        </SelectShell>
        <SelectShell aria-label={m["workloads.filter_node_aria"]()} value={nodeId} onChange={onNode}>
          <option value="">{m["workloads.filter_all"]()}</option>
          {filterOptions.nodes.map((node) => (
            <option key={node.id} value={node.id}>
              {node.label}
            </option>
          ))}
        </SelectShell>
      </div>
    </div>
  );
}
