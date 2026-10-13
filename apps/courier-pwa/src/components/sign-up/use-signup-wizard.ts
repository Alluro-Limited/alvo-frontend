import {useState} from "react";
import {useNavigate} from "@tanstack/react-router";
import {useSubmitApplicationMutation} from "@/queries/use-signup-mutation";
import type {FieldErrors} from "@/lib/signup-validation";
import {validateArea, validateExperience, validatePersonal, validateVehicle} from "@/lib/signup-validation";
import {
  EMPTY_DRAFT,
  type CourierApplicationDraft,
  type ExperienceDetails,
  type PersonalDetails,
  type VehicleDetails,
} from "@/types/signup-types";

/** 0 intro · 1 personal · 2 experience · 3 vehicle · 4 delivery area · 5 submitted. */
export type WizardStep = 0 | 1 | 2 | 3 | 4 | 5;

type Section = "personal" | "experience" | "vehicle";

function stepErrors(step: WizardStep, draft: CourierApplicationDraft): FieldErrors {
  if (step === 1) return validatePersonal(draft.personal);
  if (step === 2) return validateExperience(draft.experience);
  if (step === 3) return validateVehicle(draft.vehicle);
  if (step === 4) return validateArea(draft);
  return {};
}

export function useSignupWizard() {
  const navigate = useNavigate();
  const submit = useSubmitApplicationMutation();
  const [step, setStep] = useState<WizardStep>(0);
  const [draft, setDraft] = useState<CourierApplicationDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<FieldErrors>({});

  const clearError = (field: string) =>
    setErrors((current) => {
      if (!(field in current)) return current;
      const next = {...current};
      delete next[field];
      return next;
    });

  const patchSection = <S extends Section>(section: S, field: keyof CourierApplicationDraft[S], value: string) => {
    setDraft((current) => ({...current, [section]: {...current[section], [field]: value}}));
    clearError(field as string);
  };

  const patchPersonal = (field: keyof PersonalDetails, value: string) => patchSection("personal", field, value);
  const patchExperience = (field: keyof ExperienceDetails, value: string) => patchSection("experience", field, value);
  const patchVehicle = (field: keyof VehicleDetails, value: string) => patchSection("vehicle", field, value);
  const patchArea = (value: string) => {
    setDraft((current) => ({...current, deliveryArea: value}));
    clearError("deliveryArea");
  };

  const back = () => {
    setErrors({});
    if (step === 0) void navigate({to: "/onboarding"});
    else if (step === 5) setStep(4);
    else setStep((step - 1) as WizardStep);
  };

  const next = () => {
    const found = stepErrors(step, draft);
    if (Object.values(found).some(Boolean)) {
      setErrors(found);
      return;
    }
    if (step < 4) setStep((step + 1) as WizardStep);
    else submit.mutate(draft, {onSuccess: () => setStep(5)});
  };

  const done = () => void navigate({to: "/sign-in"});

  return {step, draft, errors, submit, patchPersonal, patchExperience, patchVehicle, patchArea, back, next, done};
}
