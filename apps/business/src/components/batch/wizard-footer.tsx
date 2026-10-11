import {Button} from "@alvo/ui";
import {ArrowLeft} from "lucide-react";
import {m} from "@/paraglide/messages";

interface WizardFooterProps {
  nextLabel: string;
  nextDisabled?: boolean;
  isPending?: boolean;
  onBack: () => void;
  onNext: () => void;
}

/** The two buttons pinned to the bottom of every wizard step. */
export function WizardFooter({nextLabel, nextDisabled, isPending, onBack, onNext}: WizardFooterProps) {
  return (
    <div className="flex w-full items-center justify-between border-t-[0.75px] border-grey-300 px-6 py-4">
      <Button variant="outline" onClick={onBack}>
        <ArrowLeft className="size-4" aria-hidden="true" />
        {m["wiz.back"]()}
      </Button>
      <Button disabled={nextDisabled} isLoading={isPending} onClick={onNext}>
        {nextLabel}
      </Button>
    </div>
  );
}
