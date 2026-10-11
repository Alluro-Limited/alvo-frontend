import {useState} from "react";
import type {BusinessInfoInput, PersonalDetailsInput} from "@/types/auth-types";
import type {SignUpStepId} from "./sign-up-layout";

const EMPTY_BUSINESS_INFO: BusinessInfoInput = {businessName: "", businessType: "", businessPhone: "", businessEmail: ""};
const EMPTY_PERSONAL_DETAILS: PersonalDetailsInput = {firstName: "", lastName: "", phone: "", email: "", password: ""};

/**
 * Client-side wizard state for the three sign-up steps. Each completed step stores its
 * values so the final `signUp` call can submit them together and going back keeps edits.
 */
export function useSignUpFlow() {
  const [step, setStep] = useState<SignUpStepId>("business");
  const [businessInfo, setBusinessInfo] = useState<BusinessInfoInput>(EMPTY_BUSINESS_INFO);
  const [personalDetails, setPersonalDetails] = useState<PersonalDetailsInput>(EMPTY_PERSONAL_DETAILS);

  function completeBusinessInfo(values: BusinessInfoInput) {
    setBusinessInfo(values);
    setStep("personal");
  }

  function completePersonalDetails(values: PersonalDetailsInput) {
    setPersonalDetails(values);
    setStep("verify");
  }

  return {step, businessInfo, personalDetails, completeBusinessInfo, completePersonalDetails};
}
