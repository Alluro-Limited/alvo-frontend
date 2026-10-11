import {Fragment} from "react";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {BatchStep} from "./use-batch-wizard";

const STEP_LABELS = [m["wiz.step1"], m["wiz.step2"], m["wiz.step3"], m["wiz.step4"]] as const;

/** The horizontal progress bar across the top of the wizard card. */
export function BatchStepper({step}: {step: BatchStep}) {
  return (
    <div className="flex w-full items-center justify-between px-6 py-6">
      <div className="flex items-center">
        {STEP_LABELS.map((label, index) => {
          const number = index + 1;
          const reached = number <= step;
          return (
            <Fragment key={label()}>
              {index > 0 && <span aria-hidden="true" className="mx-3 h-px w-10 bg-grey-300" />}
              <span className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full text-xs leading-[1.4] font-medium",
                    reached ? "bg-primary-500 text-white" : "bg-grey-100 text-grey-500"
                  )}
                >
                  {number}
                </span>
                <span className={cn("text-sm leading-[1.4] tracking-[0.14px]", reached ? "font-medium text-black" : "text-grey-500")}>
                  {label()}
                </span>
              </span>
            </Fragment>
          );
        })}
      </div>
      <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{m["wiz.step_of"]({n: step})}</p>
    </div>
  );
}
