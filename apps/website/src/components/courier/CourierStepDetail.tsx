import {AnimatePresence, motion} from "motion/react";

import {courierStepsContent} from "@/content/courier";

type Step = (typeof courierStepsContent.steps)[number];

export function CourierStepDetail({step, stepKey, reduce}: {step: Step; stepKey: number; reduce: boolean}) {
  return (
    <div className="relative min-h-[150px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={stepKey}
          initial={reduce ? false : {opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          exit={reduce ? {opacity: 0} : {opacity: 0, y: -10}}
          transition={{duration: reduce ? 0 : 0.25, ease: "easeOut"}}
          className="flex flex-col gap-3"
        >
          <img alt="" aria-hidden="true" className="size-6" src={step.icon} />
          <div className="flex flex-col gap-2">
            <h3 className="text-[28px] font-bold leading-[1.1] tracking-[-0.01em] text-black sm:text-[32px]">{step.title}</h3>
            <p className="max-w-[420px] text-base leading-[1.4] tracking-[0.01em] text-grey-600">{step.description}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
