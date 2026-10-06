import {m} from "@/paraglide/messages";
import wlSearch from "@/assets/wl-search.svg";
import {FIELD_CLASSES, SelectShell} from "./select-shell";

export interface FilterOption {
  id: string;
  label: string;
}

interface WorkloadsToolbarProps {
  query: string;
  status: string;
  searchPlaceholder: string;
  statusOptions: FilterOption[];
  onQuery: (value: string) => void;
  onStatus: (value: string) => void;
  /** Optional second dropdown — omit for surfaces that only filter by status. */
  location?: string;
  locationOptions?: FilterOption[];
  onLocation?: (value: string) => void;
}

function FilterSelect({
  ariaLabel,
  value,
  options,
  onChange,
}: {
  ariaLabel: string;
  value: string;
  options: FilterOption[];
  onChange: (v: string) => void;
}) {
  return (
    <SelectShell aria-label={ariaLabel} value={value} onChange={onChange}>
      <option value="">{m["workloads.filter_all"]()}</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.label}
        </option>
      ))}
    </SelectShell>
  );
}

/** Search field + status/location filter selects inside the rounded toolbar strip. */
export function WorkloadsToolbar({
  query,
  status,
  location,
  searchPlaceholder,
  statusOptions,
  locationOptions,
  onQuery,
  onStatus,
  onLocation,
}: WorkloadsToolbarProps) {
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
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className={`${FIELD_CLASSES} pl-12 placeholder:text-grey-500`}
        />
      </div>
      <div className="flex w-[284px] shrink-0 items-center gap-2">
        <FilterSelect ariaLabel={m["workloads.filter_status_aria"]()} value={status} options={statusOptions} onChange={onStatus} />
        {locationOptions && (
          <FilterSelect
            ariaLabel={m["workloads.filter_location_aria"]()}
            value={location ?? ""}
            options={locationOptions}
            onChange={(v) => onLocation?.(v)}
          />
        )}
      </div>
    </div>
  );
}
