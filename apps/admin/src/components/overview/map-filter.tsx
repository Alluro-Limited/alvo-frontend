import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {MapFilter} from "./map-sync";

const FILTERS: {key: MapFilter; label: () => string}[] = [
  {key: "all", label: m["overview.map_filter_all"]},
  {key: "nodes", label: m["overview.map_filter_nodes"]},
  {key: "couriers", label: m["overview.map_filter_couriers"]},
];

interface MapFilterTabsProps {
  value: MapFilter;
  onChange: (filter: MapFilter) => void;
}

/** Segmented control on the map header; narrows the markers to nodes or couriers. */
export function MapFilterTabs({value, onChange}: MapFilterTabsProps) {
  return (
    <div className="flex gap-2 rounded-lg bg-grey-200 p-1" role="tablist" aria-label={m["overview.map_title"]()}>
      {FILTERS.map(({key, label}) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={value === key}
          onClick={() => onChange(key)}
          className={cn(
            "cursor-pointer rounded px-2 py-1 text-xs leading-[1.4] font-medium tracking-[0.12px]",
            value === key ? "bg-white text-primary-500" : "text-grey-600"
          )}
        >
          {label()}
        </button>
      ))}
    </div>
  );
}
