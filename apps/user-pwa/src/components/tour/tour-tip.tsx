import {cn} from "cnfast";
import type {TourPointer, TourStep} from "./tour-steps";
import {m} from "@/paraglide/messages";

const POINTER_CLASS: Record<TourPointer, string> = {
  left: "-left-2 top-1/2 -translate-y-1/2 rotate-45 border-b border-l",
  "down-left": "-bottom-2 left-7 rotate-45 border-b border-r",
  "up-right": "-top-2 right-7 rotate-45 border-l border-t",
  "down-near-left": "-bottom-2 left-5 rotate-45 border-b border-r",
  "down-center": "-bottom-2 left-1/2 -translate-x-1/2 rotate-45 border-b border-r",
  "down-right": "-bottom-2 right-5 rotate-45 border-b border-r",
};

interface TourTipProps {
  step: TourStep;
  onSkip: () => void;
  onNext: () => void;
}

/** Coach-mark card: optional bold teal title, body, and Skip / Next (Done on the last step). */
export function TourTip({step, onSkip, onNext}: TourTipProps) {
  return (
    <div role="tooltip" className={cn("absolute", step.tipClass)}>
      <div className="relative flex w-full flex-col gap-4 rounded-[8px] border border-grey-100 bg-white p-4">
        <span aria-hidden="true" className={cn("absolute size-4 bg-white", POINTER_CLASS[step.pointer])} />
        <div className="flex w-full flex-col gap-1 text-[14px] leading-[1.4] tracking-[0.14px]">
          {step.titleKey ? <p className="font-bold text-primary-800">{m[step.titleKey]()}</p> : null}
          <p className="text-grey-600">{m[step.bodyKey]()}</p>
        </div>
        <div className="flex w-full items-center justify-between">
          {!step.last ? (
            <button
              type="button"
              onClick={onSkip}
              className="rounded-[8px] px-2 py-1 text-[14px] font-bold leading-[1.4] tracking-[0.14px] text-grey-600"
            >
              {m["tour.skip"]()}
            </button>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onNext}
            className="rounded-[8px] px-2 py-1 text-[14px] font-bold leading-[1.4] tracking-[0.14px] text-primary-500"
          >
            {step.last ? m["tour.done"]() : m["tour.next"]()}
          </button>
        </div>
      </div>
    </div>
  );
}
