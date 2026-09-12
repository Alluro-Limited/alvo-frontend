import {AnimatePresence, motion} from "motion/react";

import {courierStepsContent} from "@/content/courier";

type Step = (typeof courierStepsContent.steps)[number];

export function CourierStepPanel({step, stepKey, reduce}: {step: Step; stepKey: number; reduce: boolean}) {
  return (
    <div
      aria-hidden="true"
      className="relative aspect-square w-full max-w-[540px] shrink-0 overflow-hidden rounded-3xl bg-teal-500 lg:w-[540px]"
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={stepKey}
          src={step.phone}
          alt=""
          initial={reduce ? false : {opacity: 0, y: 16}}
          animate={{opacity: 1, y: 0}}
          exit={reduce ? {opacity: 0} : {opacity: 0, y: -16}}
          transition={{duration: reduce ? 0 : 0.32, ease: "easeOut"}}
          className="absolute left-1/2 top-[14%] w-[64%] max-w-[360px] -translate-x-1/2 drop-shadow-2xl"
        />
      </AnimatePresence>
    </div>
  );
}
