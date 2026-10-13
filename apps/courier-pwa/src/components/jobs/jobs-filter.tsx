import {m} from "@/paraglide/messages";
import {cn} from "cnfast";
import type {JobKind} from "@/types/home-types";

export type JobsFilterValue = "all" | JobKind;

const OPTIONS: {value: JobsFilterValue; label: () => string}[] = [
  {value: "all", label: () => m["jobs.all"]()},
  {value: "regular", label: () => m["jobs.regular"]()},
  {value: "speed", label: () => m["jobs.speed"]()},
];

/** The All / Regular / Speed chip row under the page heading. */
export function JobsFilter({value, onChange}: {value: JobsFilterValue; onChange: (v: JobsFilterValue) => void}) {
  return (
    <div className="mt-6 flex gap-2">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "h-[33px] rounded-[8px] px-4 text-[14px] font-medium transition-colors",
            value === o.value ? "bg-primary-500 text-white" : "bg-white text-foreground"
          )}
        >
          {o.label()}
        </button>
      ))}
    </div>
  );
}
