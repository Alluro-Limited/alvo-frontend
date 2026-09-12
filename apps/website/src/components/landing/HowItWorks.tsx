import {HowItWorksInteractive} from "./HowItWorksInteractive";
import {HowItWorksStackedStep} from "./HowItWorksStackedStep";

import {howItWorksContent} from "@/content/landing";

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-heading" className="bg-white">
      <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 lg:px-30 lg:py-25">
        <h2 id="how-it-works-heading" className="sr-only">
          {howItWorksContent.heading}
        </h2>

        {/* Mobile / tablet: every step stacked with its own illustration, no interaction */}
        <div className="flex flex-col gap-6 lg:hidden">
          {howItWorksContent.steps.map((step, index) => (
            <HowItWorksStackedStep key={step.id} step={step} index={index} />
          ))}
        </div>

        {/* Desktop: 2×2 steps + one animated illustration panel */}
        <div className="hidden lg:block">
          <HowItWorksInteractive />
        </div>
      </div>
    </section>
  );
}
