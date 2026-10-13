import type {useSignupWizard, WizardStep} from "./use-signup-wizard";
import {StepArea} from "./step-area";
import {StepExperience} from "./step-experience";
import {StepIntro} from "./step-intro";
import {StepPersonal} from "./step-personal";
import {StepSubmitted} from "./step-submitted";
import {StepVehicle} from "./step-vehicle";

type Wizard = ReturnType<typeof useSignupWizard>;

export function WizardContent({step, wizard}: {step: WizardStep; wizard: Wizard}) {
  if (step === 0) return <StepIntro />;
  if (step === 1) return <StepPersonal personal={wizard.draft.personal} errors={wizard.errors} onChange={wizard.patchPersonal} />;
  if (step === 2) return <StepExperience experience={wizard.draft.experience} errors={wizard.errors} onChange={wizard.patchExperience} />;
  if (step === 3) return <StepVehicle vehicle={wizard.draft.vehicle} errors={wizard.errors} onChange={wizard.patchVehicle} />;
  if (step === 4) return <StepArea deliveryArea={wizard.draft.deliveryArea} errors={wizard.errors} onChange={wizard.patchArea} />;
  return <StepSubmitted />;
}
