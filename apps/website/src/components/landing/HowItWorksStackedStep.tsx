import {PanelSquiggle} from "./PanelSquiggle";
import {stepIllustrations} from "./illustrations";

import {howItWorksContent} from "@/content/landing";

type Step = (typeof howItWorksContent.steps)[number];

export function HowItWorksStackedStep({step, index}: {step: Step; index: number}) {
  const Illustration = stepIllustrations[index] ?? stepIllustrations[0];

  return (
    <div className="overflow-hidden rounded-3xl border border-grey-200 bg-grey-100">
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-3">
          <span className="text-[32px] font-bold leading-none text-black">{index + 1}</span>
          <span className="flex flex-col gap-2">
            <span className="text-lg font-medium tracking-[0.01em] text-black">{step.title}</span>
            <span className="text-sm leading-[1.4] tracking-[0.01em] text-grey-600">{step.description}</span>
          </span>
        </div>

        <div
          aria-hidden="true"
          className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-2xl bg-primary-500 p-6"
        >
          <PanelSquiggle />
          <div className="relative z-10 w-full max-w-[380px]">
            <Illustration />
          </div>
        </div>
      </div>
    </div>
  );
}
