import {AnimatePresence, motion, useReducedMotion} from "motion/react";

import {PanelSquiggle} from "./PanelSquiggle";
import {stepIllustrations} from "./illustrations";

export function HowItWorksPanel({active}: {active: number}) {
  const reduceMotion = useReducedMotion();
  const Illustration = stepIllustrations[active] ?? stepIllustrations[0];

  return (
    <div aria-hidden="true" className="relative flex flex-1 items-center justify-center overflow-hidden bg-primary-500 p-6 sm:p-10">
      <PanelSquiggle />

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={reduceMotion ? false : {opacity: 0, y: 16, scale: 0.97}}
          animate={{opacity: 1, y: 0, scale: 1}}
          exit={reduceMotion ? {opacity: 0} : {opacity: 0, y: -16, scale: 0.97}}
          transition={{duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1]}}
          className="relative z-10 w-full max-w-[380px]"
        >
          <Illustration />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
