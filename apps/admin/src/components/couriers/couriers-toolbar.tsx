import {m} from "@/paraglide/messages";
import {SelectShell} from "@/components/workloads/select-shell";
import type {FilterOption} from "@/components/workloads/workloads-toolbar";
import {CourierSearchField} from "./courier-search-field";

interface CouriersToolbarProps {
  query: string;
  status: string;
  verification: string;
  vehicle: string;
  statusOptions: FilterOption[];
  verificationOptions: FilterOption[];
  vehicleOptions: FilterOption[];
  onQuery: (value: string) => void;
  onStatus: (value: string) => void;
  onVerification: (value: string) => void;
  onVehicle: (value: string) => void;
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
  onChange: (v: string) => void;
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

/** Search field plus the Status / Verification / Vehicle type selects inside the rounded strip. */
export function CouriersToolbar({
  query,
  status,
  verification,
  vehicle,
  statusOptions,
  verificationOptions,
  vehicleOptions,
  onQuery,
  onStatus,
  onVerification,
  onVehicle,
}: CouriersToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-white p-3">
      <CourierSearchField
        value={query}
        placeholder={m["couriers.search_placeholder"]()}
        onQuery={onQuery}
        className="w-full max-w-[512px]"
      />
      <div className="flex w-[448px] shrink-0 items-center gap-2">
        <FilterSelect
          ariaLabel={m["couriers.filter_status"]()}
          emptyLabel={m["couriers.filter_status"]()}
          value={status}
          options={statusOptions}
          onChange={onStatus}
        />
        <FilterSelect
          ariaLabel={m["couriers.filter_verification"]()}
          emptyLabel={m["couriers.filter_verification"]()}
          value={verification}
          options={verificationOptions}
          onChange={onVerification}
        />
        <FilterSelect
          ariaLabel={m["couriers.filter_vehicle"]()}
          emptyLabel={m["couriers.filter_vehicle"]()}
          value={vehicle}
          options={vehicleOptions}
          onChange={onVehicle}
        />
      </div>
    </div>
  );
}
