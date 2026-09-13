import {Check, Circle} from "lucide-react";

import {trackingContent} from "@/content/tracking";

export function TrackingTimeline() {
  const steps = trackingContent.result.timeline;

  return (
    <ul className="flex w-full flex-col gap-0">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <li key={step.title} className="relative flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`flex size-4 items-center justify-center rounded-[2px] ${step.completed ? "bg-primary-500 text-white" : "bg-grey-400 text-white"}`}
              >
                {step.completed ? <Check className="size-2.5" strokeWidth={3} /> : <Circle className="size-2.5" strokeWidth={3} />}
              </div>
              {!isLast && <div className="h-[50px] w-[2px] bg-primary-500" />}
            </div>
            <div className="pb-6">
              <p className={`font-sans text-sm font-medium tracking-[0.14px] ${step.completed ? "text-black" : "text-grey-500"}`}>
                {step.title}
              </p>
              <p className="font-sans text-xs font-normal tracking-[0.12px] text-grey-500">{step.detail}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
