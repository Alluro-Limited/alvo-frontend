import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {BatchStep} from "./use-batch-wizard";

const STEPS = [
  {title: m["wiz.step1"], desc: m["wiz.step1_d"]},
  {title: m["wiz.step2"], desc: m["wiz.step2_d"]},
  {title: m["wiz.step3"], desc: m["wiz.step3_d"]},
  {title: m["wiz.step4"], desc: m["wiz.step4_d"]},
] as const;

/** The step-1 right panel: a vertical preview of the four wizard stages. */
export function StepList({step}: {step: BatchStep}) {
  return (
    <div className="flex w-full flex-col gap-6 rounded-lg border border-grey-300 bg-white p-6">
      {STEPS.map((item, index) => {
        const active = index + 1 === step;
        return (
          <div key={item.title()} className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full text-xs leading-[1.4] font-medium",
                active ? "bg-primary-500 text-white" : "bg-grey-100 text-grey-500"
              )}
            >
              {index + 1}
            </span>
            <span className="flex flex-col gap-1">
              <span className={cn("text-sm leading-[1.4] tracking-[0.14px]", active ? "font-medium text-black" : "text-grey-600")}>
                {item.title()}
              </span>
              <span className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{item.desc()}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
