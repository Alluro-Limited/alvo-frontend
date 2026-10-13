import {ChevronDown} from "lucide-react";
import {cn} from "cnfast";
import type {SafeDuration} from "@/types/safe-types";
import {m} from "@/paraglide/messages";

interface DurationFieldProps {
  durations: SafeDuration[];
  value: string | null;
  onChange: (durationId: string) => void;
}

/** "Duration" select — a bordered dropdown box styled like the other wizard inputs. */
export function DurationField({durations, value, onChange}: DurationFieldProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor="safe-duration" className="text-[16px] leading-[1.4] tracking-[0.16px] text-primary-800">
        {m["safe.duration"]()}
      </label>
      <div className="relative flex w-full items-center overflow-clip rounded-[8px] border-[0.75px] border-grey-300 focus-within:border-primary-500">
        <select
          id="safe-duration"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full appearance-none bg-transparent px-4 py-3.5 text-[14px] leading-[1.4] tracking-[0.14px] focus:outline-none",
            value ? "text-foreground" : "text-grey-500"
          )}
        >
          <option value="" disabled>
            {m["safe.duration_ph"]()}
          </option>
          {durations.map((d) => (
            <option key={d.id} value={d.id}>
              {d.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 size-5 text-grey-500" aria-hidden="true" />
      </div>
    </div>
  );
}
