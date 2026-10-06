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
  location: string;
  searchPlaceholder: string;
  statusOptions: FilterOption[];
  locationOptions: FilterOption[];
  onQuery: (value: string) => void;
  onStatus: (value: string) => void;
  onLocation: (value: string) => void;
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
        <SelectShell aria-label={m["workloads.filter_status_aria"]()} value={status} onChange={onStatus}>
          <option value="">{m["workloads.filter_all"]()}</option>
          {statusOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </SelectShell>
        <SelectShell aria-label={m["workloads.filter_location_aria"]()} value={location} onChange={onLocation}>
          <option value="">{m["workloads.filter_all"]()}</option>
          {locationOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </SelectShell>
      </div>
    </div>
  );
}
