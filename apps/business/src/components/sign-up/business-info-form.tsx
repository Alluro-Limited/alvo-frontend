import {Link} from "@tanstack/react-router";
import {Button} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import {AuthTextField} from "@/components/auth/text-field";
import type {BusinessInfoInput} from "@/types/auth-types";
import {BusinessTypeField} from "./business-type-field";
import {StepHeader} from "./step-header";
import {useBusinessInfoForm} from "./use-business-info-form";

const contactFields: {
  name: "businessPhone" | "businessEmail";
  type: "tel" | "email";
  autoComplete: string;
  label: () => string;
  placeholder: () => string;
}[] = [
  {
    name: "businessPhone",
    type: "tel",
    autoComplete: "tel",
    label: m["sign_up.business_phone_label"],
    placeholder: m["sign_up.business_phone_placeholder"],
  },
  {
    name: "businessEmail",
    type: "email",
    autoComplete: "email",
    label: m["sign_up.business_email_label"],
    placeholder: m["sign_up.business_email_placeholder"],
  },
];

interface BusinessInfoFormProps {
  initialValues: BusinessInfoInput;
  onNext: (values: BusinessInfoInput) => void;
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
          {contactFields.map((field) => (
            <AuthTextField
              key={field.name}
              label={field.label()}
              error={fieldErrors[field.name]}
              type={field.type}
              name={field.name}
              autoComplete={field.autoComplete}
              placeholder={field.placeholder()}
              value={values[field.name]}
              onChange={(event) => setField(field.name, event.target.value)}
            />
          ))}
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
