import {ChevronLeft} from "lucide-react";
import {ProgressBar} from "./progress-bar";
import {m} from "@/paraglide/messages";

interface WizardHeaderProps {
  /** 0 = intro (no progress), 1-4 = application steps. */
  step: number;
  onBack: () => void;
}

export function WizardHeader({step, onBack}: WizardHeaderProps) {
  return (
    <header className="flex h-8 items-center justify-between">
      <button type="button" onClick={onBack} aria-label={m["nav.back"]()} className="-ml-1 flex size-8 items-center justify-center">
        <ChevronLeft className="size-6" aria-hidden="true" />
      </button>
      {step >= 1 && step <= 4 && <ProgressBar step={step} />}
    </header>
  );
}
