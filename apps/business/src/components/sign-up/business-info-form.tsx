import {Link} from "@tanstack/react-router";
import {Button} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import {AuthTextField} from "@/components/auth/text-field";
import type {BusinessInfoInput} from "@/types/auth-types";
import {BusinessTypeField} from "./business-type-field";
import {PhoneField} from "./phone-field";
import {StepHeader} from "./step-header";
import {useBusinessInfoForm} from "./use-business-info-form";

interface BusinessInfoFormProps {
  initialValues: BusinessInfoInput;
  onNext: (values: BusinessInfoInput) => void;
}

function ContactFields({
  values,
  fieldErrors,
  setField,
}: {
  values: BusinessInfoInput;
  fieldErrors: Partial<Record<keyof BusinessInfoInput, string>>;
  setField: (field: keyof BusinessInfoInput, value: string) => void;
}) {
  return (
    <>
      <PhoneField
        label={m["sign_up.business_phone_label"]()}
        error={fieldErrors.businessPhone}
        name="businessPhone"
        placeholder={m["sign_up.business_phone_placeholder"]()}
        value={values.businessPhone}
        onChange={(value) => setField("businessPhone", value)}
      />
      <AuthTextField
        label={m["sign_up.business_email_label"]()}
        error={fieldErrors.businessEmail}
        type="email"
        name="businessEmail"
        autoComplete="email"
        placeholder={m["sign_up.business_email_placeholder"]()}
        value={values.businessEmail}
        onChange={(event) => setField("businessEmail", event.target.value)}
      />
    </>
  );
}

export function BusinessInfoForm({initialValues, onNext}: BusinessInfoFormProps) {
  const {values, fieldErrors, setField, handleSubmit} = useBusinessInfoForm(initialValues, onNext);

  return (
    <div className="flex w-full flex-col items-center gap-10">
      <div className="flex w-full flex-col gap-8">
        <StepHeader title={m["sign_up.business_title"]()} description={m["sign_up.business_description"]()} />
        <form noValidate onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          <AuthTextField
            label={m["sign_up.business_name_label"]()}
            error={fieldErrors.businessName}
            type="text"
            name="businessName"
            autoComplete="organization"
            placeholder={m["sign_up.business_name_placeholder"]()}
            value={values.businessName}
            onChange={(event) => setField("businessName", event.target.value)}
          />
          <BusinessTypeField
            value={values.businessType}
            error={fieldErrors.businessType}
            onChange={(value) => setField("businessType", value)}
          />
          <ContactFields values={values} fieldErrors={fieldErrors} setField={setField} />
          <Button type="submit" className="w-full text-base">
            {m["sign_up.continue"]()}
          </Button>
        </form>
      </div>
      <p className="text-sm leading-[1.4] tracking-[0.01em]">
        {m["sign_up.have_account"]()}{" "}
        <Link to="/" className="font-medium text-primary-500 hover:underline">
          {m["sign_up.sign_in"]()}
        </Link>
      </p>
    </div>
  );
}
