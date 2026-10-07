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
  verification: string;
  vehicle: string;
  statusOptions: FilterOption[];
  verificationOptions: FilterOption[];
  vehicleOptions: FilterOption[];
  onToggleCollapsed: () => void;
  onView: (view: ListMapView) => void;
  onQuery: (value: string) => void;
  onStatus: (value: string) => void;
  onVerification: (value: string) => void;
  onVehicle: (value: string) => void;
  children: React.ReactNode;
}

/** The floating left column: List/Map pills + collapse toggle, then search/filters and the courier cards. */
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
  | "query"
  | "status"
  | "verification"
  | "vehicle"
  | "statusOptions"
  | "verificationOptions"
  | "vehicleOptions"
  | "onQuery"
  | "onStatus"
  | "onVerification"
  | "onVehicle"
>;

/** The rounded white block with the search field and the three filter selects. */
function FilterBlock({query, onQuery, ...selects}: FilterBlockProps) {
  return (
    <div className="flex flex-col gap-2 rounded-3xl border border-grey-200 bg-white p-3">
      <CourierSearchField value={query} placeholder={m["couriers.map_search_placeholder"]()} onQuery={onQuery} />
      <SelectFilters {...selects} />
    </div>
  );
}

interface FilterSelectSpec {
  ariaLabel: string;
  emptyLabel: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

function FilterSelect({ariaLabel, emptyLabel, value, options, onChange}: FilterSelectSpec) {
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

/** Status + verification on one row, vehicle on its own row below. */
function SelectFilters({
  status,
  verification,
  vehicle,
  statusOptions,
  verificationOptions,
  vehicleOptions,
  onStatus,
  onVerification,
  onVehicle,
}: Omit<FilterBlockProps, "query" | "onQuery">) {
  return (
    <>
      <div className="flex items-center gap-2">
        <FilterSelect
          ariaLabel={m["couriers.filter_status"]()}
          emptyLabel={m["couriers.map_status_label"]()}
          value={status}
          options={statusOptions}
          onChange={onStatus}
        />
        <FilterSelect
          ariaLabel={m["couriers.filter_verification"]()}
          emptyLabel={m["couriers.map_verification_label"]()}
          value={verification}
          options={verificationOptions}
          onChange={onVerification}
        />
      </div>
      <FilterSelect
        ariaLabel={m["couriers.filter_vehicle"]()}
        emptyLabel={m["couriers.map_vehicle_label"]()}
        value={vehicle}
        options={vehicleOptions}
        onChange={onVehicle}
      />
    </>
  );
}
