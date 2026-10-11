import {Button} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import {AuthAlert} from "@/components/auth/auth-alert";
import {FormField} from "@/components/auth/form-field";
import {PasswordInput} from "@/components/auth/password-input";
import {AuthTextField} from "@/components/auth/text-field";
import {authInputClassName} from "@/components/auth/auth-input-styles";
import type {BusinessInfoInput, PersonalDetailsInput} from "@/types/auth-types";
import {StepHeader} from "./step-header";
import {TermsNotice} from "./terms-notice";
import {usePersonalDetailsForm} from "./use-personal-details-form";

const textFields: {
  name: "firstName" | "lastName" | "phone" | "email";
  type: "text" | "tel" | "email";
  autoComplete: string;
  label: () => string;
  placeholder: () => string;
}[] = [
  {
    name: "firstName",
    type: "text",
    autoComplete: "given-name",
    label: m["sign_up.first_name_label"],
    placeholder: m["sign_up.first_name_placeholder"],
  },
  {
    name: "lastName",
    type: "text",
    autoComplete: "family-name",
    label: m["sign_up.last_name_label"],
    placeholder: m["sign_up.last_name_placeholder"],
  },
  {name: "phone", type: "tel", autoComplete: "tel", label: m["sign_up.phone_label"], placeholder: m["sign_up.phone_placeholder"]},
  {name: "email", type: "email", autoComplete: "email", label: m["sign_up.email_label"], placeholder: m["sign_up.email_placeholder"]},
];

interface PersonalDetailsFormProps {
  businessInfo: BusinessInfoInput;
  initialValues: PersonalDetailsInput;
  onNext: (values: PersonalDetailsInput) => void;
}

export function PersonalDetailsForm({businessInfo, initialValues, onNext}: PersonalDetailsFormProps) {
  const {values, fieldErrors, alert, setField, handleSubmit, isPending, isLocked} = usePersonalDetailsForm(
    businessInfo,
    initialValues,
    onNext
  );

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <StepHeader title={m["sign_up.personal_title"]()} description={m["sign_up.personal_description"]()} />
      <form noValidate onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
        {alert && <AuthAlert tone={alert.tone}>{alert.message}</AuthAlert>}
        {textFields.map((field) => (
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
        <FormField label={m["sign_up.password_label"]()} error={fieldErrors.password} hint={m["sign_up.password_hint"]()}>
          {(control) => (
            <PasswordInput
              {...control}
              name="password"
              autoComplete="new-password"
              placeholder={m["sign_up.password_placeholder"]()}
              value={values.password}
              onChange={(event) => setField("password", event.target.value)}
              className={authInputClassName}
            />
          )}
        </FormField>
        <TermsNotice />
        <Button type="submit" isLoading={isPending} disabled={isLocked} className="w-full text-base">
          {isPending ? m["sign_up.continue_loading"]() : m["sign_up.continue"]()}
        </Button>
      </form>
    </div>
  );
}
