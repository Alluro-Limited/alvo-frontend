import {cn} from "cnfast";
import type {ActivityFilter} from "@/types/activity-types";
import type {SimpleMessage} from "@/lib/i18n";
import {m} from "@/paraglide/messages";

const FILTERS: {id: ActivityFilter; labelKey: SimpleMessage}[] = [
  {id: "all", labelKey: "act.chip_all"},
  {id: "active", labelKey: "act.chip_active"},
  {id: "completed", labelKey: "act.chip_done"},
  {id: "cancelled", labelKey: "act.chip_cancelled"},
];

/** All / Active / Completed / Cancelled filter chips under the Activities title. */
export function ActivityChips({value, onChange}: {value: ActivityFilter; onChange: (filter: ActivityFilter) => void}) {
  return (
    <div className="flex items-center gap-2" role="radiogroup" aria-label={m["act.title"]()}>
      {FILTERS.map((f) => (
        <button
          key={f.id}
          type="button"
          role="radio"
          aria-checked={value === f.id}
          onClick={() => onChange(f.id)}
          className={cn(
            "flex items-center justify-center rounded-[4px] px-4 py-2 text-[12px] font-medium leading-[1.4] tracking-[0.12px]",
            value === f.id ? "bg-primary-500 text-white" : "border border-[#f7f9fc] text-foreground"
          )}
        >
          {m[f.labelKey]()}
        </button>
      ))}
    </div>
  );
}
