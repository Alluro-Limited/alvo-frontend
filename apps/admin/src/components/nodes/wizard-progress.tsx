import {Check} from "lucide-react";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";

export const WIZARD_STEP_NAMES: (() => string)[] = [
  m["nodes.step_basic"],
  m["nodes.step_location"],
  m["nodes.step_capacity"],
  m["nodes.step_review"],
];

/** The four-step indicator — filled check for done, teal ring for current, grey for upcoming. */
export function WizardProgress({step}: {step: number}) {
  return (
    <ol className="flex items-center" aria-label={m["nodes.register_step_label"]({step: step + 1, name: WIZARD_STEP_NAMES[step]()})}>
      {WIZARD_STEP_NAMES.map((name, index) => (
        <li key={name()} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <span
              className={cn(
                "flex size-6 items-center justify-center rounded-full border-2 text-xs leading-[1.4] font-medium",
                index < step
                  ? "border-primary-500 bg-primary-500 text-white"
                  : index === step
                    ? "border-primary-500 text-primary-500"
                    : "border-grey-300 text-grey-500"
              )}
              aria-current={index === step ? "step" : undefined}
            >
              {index < step ? <Check className="size-3.5" aria-hidden="true" /> : index + 1}
            </span>
            <span
              className={cn("text-xs leading-[1.4] tracking-[0.12px] whitespace-nowrap", index <= step ? "text-black" : "text-grey-500")}
            >
              {name()}
            </span>
          </div>
          {index < WIZARD_STEP_NAMES.length - 1 && (
            <span className={cn("mx-2 mb-5 h-0.5 w-10", index < step ? "bg-primary-500" : "bg-grey-300")} aria-hidden="true" />
          )}
        </li>
      ))}
    </ol>
  );
}
