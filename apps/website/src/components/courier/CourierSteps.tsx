import {useEffect, useState} from "react";
import {useReducedMotion} from "motion/react";

import {CourierAppButton} from "./CourierAppButton";
import {CourierStepDetail} from "./CourierStepDetail";
import {CourierStepPanel} from "./CourierStepPanel";
import {CourierStepProgress} from "./CourierStepProgress";
import {Eyebrow} from "@/components/landing/Eyebrow";

import {courierStepsContent} from "@/content/courier";

const STEP_MS = 5000;

export function CourierSteps() {
  const {steps} = courierStepsContent;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion() ?? false;

  useEffect(() => {
    if (paused || reduce) return undefined;
    const id = setTimeout(() => setActive((current) => (current + 1) % steps.length), STEP_MS);
    return () => clearTimeout(id);
  }, [active, paused, reduce, steps.length]);

  return (
    <section aria-labelledby="courier-steps-heading" className="bg-grey-100">
      <div
        className="mx-auto flex max-w-[1440px] flex-col items-center gap-10 px-6 py-16 md:px-10 lg:px-30 lg:py-25"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div className="flex max-w-[520px] flex-col items-center gap-3.5 text-center">
          <Eyebrow label={courierStepsContent.eyebrow} />
          <h2
            id="courier-steps-heading"
            className="text-[32px] font-bold leading-[1.1] tracking-[-0.01em] text-black sm:text-[38px] lg:text-[42px]"
          >
            {courierStepsContent.heading}
          </h2>
        </div>

        <div className="flex w-full flex-col-reverse items-center gap-10 lg:flex-row lg:items-stretch lg:gap-[72px]">
          <div className="flex w-full flex-col justify-between gap-8 lg:flex-1 lg:py-2">
            <div className="flex flex-col gap-6">
              <CourierStepProgress steps={steps} active={active} onSelect={setActive} />
              <CourierStepDetail step={steps[active]} stepKey={active} reduce={reduce} />
            </div>

            <CourierAppButton label={courierStepsContent.cta} href={courierStepsContent.ctaHref} />
          </div>

          <CourierStepPanel step={steps[active]} stepKey={active} reduce={reduce} />
        </div>
      </div>
    </section>
  );
}
