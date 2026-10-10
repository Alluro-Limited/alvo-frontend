import {useState} from "react";
import {Button, Dialog, DialogBackdrop, DialogClose, DialogPopup, DialogPortal, DialogTitle} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import wlClose from "@/assets/wl-close.svg";
import type {RegisterNodeInput} from "@/types/nodes-types";
import {EMPTY_WIZARD_FORM, stepValid, toRegisterInput, type WizardForm} from "./register-wizard-types";
import {WizardProgress, WIZARD_STEP_NAMES} from "./wizard-progress";
import {WizardStepBasic} from "./wizard-step-basic";
import {WizardStepCapacity} from "./wizard-step-capacity";
import {WizardStepLocation} from "./wizard-step-location";
import {WizardStepReview} from "./wizard-step-review";

interface RegisterNodeDialogProps {
  submitting: boolean;
  failed: boolean;
  onClose: () => void;
  onSubmit: (input: RegisterNodeInput) => void;
}

const LAST_STEP = WIZARD_STEP_NAMES.length - 1;

function StepBody({
  step,
  form,
  showErrors,
  onChange,
}: {
  step: number;
  form: WizardForm;
  showErrors: boolean;
  onChange: <K extends keyof WizardForm>(key: K, value: WizardForm[K]) => void;
}) {
  if (step === 0) return <WizardStepBasic form={form} showErrors={showErrors} onChange={onChange} />;
  if (step === 1) return <WizardStepLocation form={form} showErrors={showErrors} onChange={onChange} />;
  if (step === 2) return <WizardStepCapacity form={form} showErrors={showErrors} onChange={onChange} />;
  return <WizardStepReview form={form} />;
}

/** Four-step registration wizard — Basic Info → Location → Capacity → Review, then submit. */
export function RegisterNodeDialog({submitting, failed, onClose, onSubmit}: RegisterNodeDialogProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<WizardForm>(EMPTY_WIZARD_FORM);
  const [attempted, setAttempted] = useState(false);

  const showErrors = attempted && !stepValid(step, form);
  const advance = () => {
    if (!stepValid(step, form)) {
      setAttempted(true);
      return;
    }
    setAttempted(false);
    if (step === LAST_STEP) onSubmit(toRegisterInput(form));
    else setStep(step + 1);
  };

  return (
    <Dialog open onOpenChange={(next) => !next && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="flex max-h-[calc(100vh-64px)] w-[560px] max-w-[calc(100vw-32px)] flex-col p-6">
          <WizardHeader step={step} />

          <div className="flex justify-center py-4">
            <WizardProgress step={step} />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <StepBody
              step={step}
              form={form}
              showErrors={showErrors}
              onChange={(key, value) => setForm((current) => ({...current, [key]: value}))}
            />
            {failed && <p className="pt-3 text-sm leading-[1.4] tracking-[0.14px] text-status-fail">{m["nodes.submit_error"]()}</p>}
          </div>

          <WizardFooter step={step} submitting={submitting} onCancel={onClose} onBack={() => setStep(step - 1)} onAdvance={advance} />
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}

function WizardHeader({step}: {step: number}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <DialogTitle className="text-xl leading-[1.3] font-semibold text-black">{m["nodes.register_title"]()}</DialogTitle>
        <p className="pt-1 text-sm leading-[1.4] tracking-[0.14px] text-grey-500">
          {m["nodes.register_step_label"]({step: step + 1, name: WIZARD_STEP_NAMES[step]()})}
        </p>
      </div>
      <DialogClose className="rounded p-0.5 text-grey-600 hover:bg-grey-100" aria-label={m["workloads.close"]()}>
        <img src={wlClose} alt="" className="size-6" aria-hidden="true" />
      </DialogClose>
    </div>
  );
}

function WizardFooter({
  step,
  submitting,
  onCancel,
  onBack,
  onAdvance,
}: {
  step: number;
  submitting: boolean;
  onCancel: () => void;
  onBack: () => void;
  onAdvance: () => void;
}) {
  const lastLabel = submitting ? m["nodes.register_submitting"]() : m["nodes.register_submit"]();
  return (
    <div className="flex items-center justify-between pt-5">
      <Button variant="outline" onClick={onCancel}>
        {m["nodes.cancel"]()}
      </Button>
      <div className="flex gap-2">
        {step > 0 && (
          <Button variant="outline" onClick={onBack}>
            {m["nodes.go_back"]()}
          </Button>
        )}
        <Button isLoading={submitting} onClick={onAdvance}>
          {step === LAST_STEP ? lastLabel : m["nodes.continue"]()}
        </Button>
      </div>
    </div>
  );
}
