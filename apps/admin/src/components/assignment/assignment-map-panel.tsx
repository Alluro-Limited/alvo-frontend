import {PanelLeftClose, PanelLeftOpen} from "lucide-react";
import {m} from "@/paraglide/messages";
import wlSearch from "@/assets/wl-search.svg";
import {ViewTabs, type ListMapView} from "@/components/view-tabs";
import {FIELD_CLASSES, SelectShell} from "@/components/workloads/select-shell";
import type {FilterOption} from "@/components/workloads/workloads-toolbar";

interface AssignmentMapPanelProps {
  collapsed: boolean;
  query: string;
  status: string;
  type: string;
  statusOptions: FilterOption[];
  typeOptions: FilterOption[];
  onToggleCollapsed: () => void;
  onView: (view: ListMapView) => void;
  onQuery: (value: string) => void;
  onStatus: (value: string) => void;
  onType: (value: string) => void;
  children: React.ReactNode;
}

/** The floating left column: List/Map pills + collapse toggle, then search/filters and the card list. */
export function AssignmentMapPanel({
  collapsed,
  query,
  status,
  type,
  statusOptions,
  typeOptions,
  onToggleCollapsed,
  onView,
  onQuery,
  onStatus,
  onType,
  children,
}: AssignmentMapPanelProps) {
  const CollapseIcon = collapsed ? PanelLeftOpen : PanelLeftClose;
  return (
    <div className="absolute top-2 bottom-2 left-2 flex w-[367px] flex-col gap-2">
      <div className="flex items-center gap-2.5">
        <ViewTabs value="map" onChange={onView} ariaLabel={m["nav.assignment"]()} />
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-expanded={!collapsed}
          className="flex h-10 items-center gap-1.5 rounded-lg bg-white px-4 text-sm leading-[1.4] font-medium tracking-[0.14px] text-grey-600"
        >
          <CollapseIcon className="size-4" aria-hidden="true" />
          {collapsed ? m["assignment.map_expand"]() : m["assignment.map_collapse"]()}
        </button>
      </div>
      {!collapsed && (
        <>
          <FilterBlock
            query={query}
            status={status}
            type={type}
            statusOptions={statusOptions}
            typeOptions={typeOptions}
            onQuery={onQuery}
            onStatus={onStatus}
            onType={onType}
          />
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto rounded-lg bg-white p-3" data-testid="assignment-map-cards">
            {children}
          </div>
        </>
      )}
    </div>
  );
}

type FilterBlockProps = Pick<
  AssignmentMapPanelProps,
  "query" | "status" | "type" | "statusOptions" | "typeOptions" | "onQuery" | "onStatus" | "onType"
>;

/** The rounded white block with the search field and the two filter selects. */
function FilterBlock({query, status, type, statusOptions, typeOptions, onQuery, onStatus, onType}: FilterBlockProps) {
  return (
    <div className="flex flex-col gap-2 rounded-3xl border border-grey-200 bg-white p-3">
      <div className="relative">
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
          placeholder={m["assignment.map_search_placeholder"]()}
          aria-label={m["assignment.map_search_placeholder"]()}
          className={`${FIELD_CLASSES} pl-12 placeholder:text-grey-500`}
        />
      </div>
      <div className="flex items-center gap-2">
        <SelectShell aria-label={m["assignment.filter_status_aria"]()} value={status} onChange={onStatus}>
          <option value="">{m["assignment.map_status_label"]()}</option>
          {statusOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </SelectShell>
        <SelectShell aria-label={m["assignment.filter_type_aria"]()} value={type} onChange={onType}>
          <option value="">{m["assignment.map_type_label"]()}</option>
          {typeOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </SelectShell>
      </div>
    </div>
  );
}
