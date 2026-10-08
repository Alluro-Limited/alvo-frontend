import {PanelLeftClose, PanelLeftOpen} from "lucide-react";
import {m} from "@/paraglide/messages";
import {ViewTabs, type ListMapView} from "@/components/view-tabs";
import {SelectShell} from "@/components/workloads/select-shell";
import type {FilterOption} from "@/components/workloads/workloads-toolbar";
import {CourierSearchField} from "./courier-search-field";

interface CouriersMapPanelProps {
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

/** The floating left column: List/Map pills + collapse toggle, then search/filters and the track cards. */
export function CouriersMapPanel({collapsed, onToggleCollapsed, onView, children, ...filters}: CouriersMapPanelProps) {
  const CollapseIcon = collapsed ? PanelLeftOpen : PanelLeftClose;
  return (
    <div className="absolute top-2 bottom-2 left-2 flex w-[367px] flex-col gap-2">
      <div className="flex items-center gap-2.5">
        <ViewTabs value="map" onChange={onView} ariaLabel={m["nav.courier"]()} />
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-expanded={!collapsed}
          className="flex h-10 items-center gap-1.5 rounded-lg bg-white px-4 text-sm leading-[1.4] font-medium tracking-[0.14px] text-grey-600"
        >
          <CollapseIcon className="size-4" aria-hidden="true" />
          {collapsed ? m["couriers.map_expand"]() : m["couriers.map_collapse"]()}
        </button>
      </div>
      {!collapsed && (
        <>
          <FilterBlock {...filters} />
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto rounded-lg bg-white p-3" data-testid="couriers-map-cards">
            {children}
          </div>
        </>
      )}
    </div>
  );
}

type FilterBlockProps = Pick<
  CouriersMapPanelProps,
  "query" | "status" | "type" | "statusOptions" | "typeOptions" | "onQuery" | "onStatus" | "onType"
>;

/** The rounded white block with the search field and the two filter selects. */
function FilterBlock({query, status, type, statusOptions, typeOptions, onQuery, onStatus, onType}: FilterBlockProps) {
  return (
    <div className="flex flex-col gap-2 rounded-3xl border border-grey-200 bg-white p-3">
      <CourierSearchField value={query} placeholder={m["couriers.map_search_placeholder"]()} onQuery={onQuery} />
      <div className="flex items-center gap-2">
        <FilterSelect
          ariaLabel={m["couriers.filter_status"]()}
          emptyLabel={m["couriers.map_status_label"]()}
          value={status}
          options={statusOptions}
          onChange={onStatus}
        />
        <FilterSelect
          ariaLabel={m["couriers.map_type_label"]()}
          emptyLabel={m["couriers.map_type_label"]()}
          value={type}
          options={typeOptions}
          onChange={onType}
        />
      </div>
    </div>
  );
}

function FilterSelect({
  ariaLabel,
  emptyLabel,
  value,
  options,
  onChange,
}: {
  ariaLabel: string;
  emptyLabel: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}) {
  return (
    <SelectShell aria-label={ariaLabel} value={value} onChange={onChange}>
      <option value="">{emptyLabel}</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.label}
        </option>
      ))}
    </SelectShell>
  );
}
