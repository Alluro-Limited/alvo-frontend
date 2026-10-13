import {ChevronLeft} from "lucide-react";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";

interface SendHeaderProps {
  /** 1–`segments` filled segments; omit for the service-picker screen which has no progress. */
  step?: number;
  /** Number of segments in the indicator — 4 for Send, 3 for Safe Storage. */
  segments?: number;
  onBack: () => void;
}

/** Wizard header: back arrow on the left, segmented progress indicator on the right. */
export function SendHeader({step, segments = 4, onBack}: SendHeaderProps) {
  return (
    <header className="flex h-9 w-full items-center justify-between">
      <button type="button" onClick={onBack} aria-label={m["auth.back"]()} className="flex size-8 items-center justify-center">
        <ChevronLeft className="size-6" aria-hidden="true" />
      </button>
      {step ? (
        <div className="flex items-center gap-1" aria-hidden="true">
          {Array.from({length: segments}, (_, i) => i + 1).map((i) => (
            <span key={i} className={cn("h-1 w-6 rounded-[1px]", i <= step ? "bg-primary-500" : "bg-grey-300")} />
          ))}
        </div>
      ) : null}
    </header>
  );
}
