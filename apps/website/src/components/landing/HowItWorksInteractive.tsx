import {useState} from "react";

import {HowItWorksPanel} from "./HowItWorksPanel";
import {HowItWorksStep} from "./HowItWorksStep";

import {howItWorksContent} from "@/content/landing";

export function HowItWorksInteractive() {
  const [active, setActive] = useState(0);

  return (
    <div className="overflow-hidden rounded-3xl border border-grey-200 bg-grey-200">
      <div className="flex items-stretch">
        <div className="grid flex-[1.45] grid-cols-2 gap-px bg-grey-200">
          {howItWorksContent.steps.map((step, index) => (
            <HowItWorksStep key={step.id} step={step} index={index} active={active === index} onSelect={() => setActive(index)} />
          ))}
        </div>

        <HowItWorksPanel active={active} />
      </div>
    </div>
  );
}
