import {cn} from "cnfast";
import {BellRing} from "lucide-react";
import {m} from "@/paraglide/messages";

interface AvailabilityPillProps {
  live: boolean;
  pending: boolean;
  onToggle: (live: boolean) => void;
}

/** The dark pill under the header: bell + status copy + the live/offline switch. */
export function AvailabilityPill({live, pending, onToggle}: AvailabilityPillProps) {
  return (
    <div className="flex h-[48px] items-center gap-3 rounded-[10px] bg-[#0f2d28] px-4">
      <BellRing className="size-5 text-amber-400" aria-hidden="true" />
      <p className="flex-1 text-[13px] font-medium text-white">{live ? m["home.live"]() : m["home.offline"]()}</p>
      <button
        type="button"
        role="switch"
        aria-checked={live}
        aria-label={m["home.availability"]()}
        disabled={pending}
        onClick={() => onToggle(!live)}
        className={cn(
          "relative h-[22px] w-[40px] shrink-0 rounded-full transition-colors disabled:opacity-60",
          live ? "bg-primary-500" : "bg-white/90"
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-1/2 size-[16px] -translate-y-1/2 rounded-full transition-all",
            live ? "right-[3px] bg-white" : "left-[3px] bg-grey-500"
          )}
        />
      </button>
    </div>
  );
}
