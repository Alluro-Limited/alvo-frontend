import {BusinessInfoForm} from "@/components/sign-up/business-info-form";
import {PersonalDetailsForm} from "@/components/sign-up/personal-details-form";
import {SignUpLayout} from "@/components/sign-up/sign-up-layout";
import {useSignUpFlow} from "@/components/sign-up/use-sign-up-flow";
import {VerifyEmailForm} from "@/components/sign-up/verify-email-form";

export function SignUpPage() {
  const {step, businessInfo, personalDetails, completeBusinessInfo, completePersonalDetails} = useSignUpFlow();

  return (
    <SignUpLayout step={step}>
      <div className="w-full max-w-[416px]">
        {step === "business" && <BusinessInfoForm initialValues={businessInfo} onNext={completeBusinessInfo} />}
        {step === "personal" && (
          <PersonalDetailsForm businessInfo={businessInfo} initialValues={personalDetails} onNext={completePersonalDetails} />
        )}
        {step === "verify" && <VerifyEmailForm />}
      </div>
    </SignUpLayout>
  );
}
