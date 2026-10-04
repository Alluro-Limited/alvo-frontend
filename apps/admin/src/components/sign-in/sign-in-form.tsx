import {Input} from "@alvo/ui";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import {AuthAlert} from "@/components/auth/auth-alert";
import {FormField} from "@/components/auth/form-field";
import {PasswordInput} from "@/components/auth/password-input";
import {SignInActions} from "./sign-in-actions";
import {authInputClassName} from "@/components/auth/auth-input-styles";
import {useSignInForm} from "./use-sign-in-form";

export function SignInForm() {
  const {values, fieldErrors, alert, setField, handleSubmit, isPending, isLocked} = useSignInForm();

  return (
    <form noValidate onSubmit={handleSubmit} className="flex w-full flex-col gap-8">
      {alert && <AuthAlert tone={alert.tone}>{alert.message}</AuthAlert>}

      <div className="flex flex-col gap-6">
        <FormField label={m["auth.email_label"]()} error={fieldErrors.email}>
          {(control) => (
            <Input
              {...control}
              type="email"
              name="email"
              autoComplete="username"
              placeholder={m["sign_in.email_placeholder"]()}
              value={values.email}
              onChange={(event) => setField("email", event.target.value)}
              className={cn(authInputClassName, "text-sm")}
            />
          )}
        </FormField>
        <FormField label={m["sign_in.password_label"]()} error={fieldErrors.password}>
          {(control) => (
            <PasswordInput
              {...control}
              name="password"
              autoComplete="current-password"
              placeholder={m["sign_in.password_placeholder"]()}
              value={values.password}
              onChange={(event) => setField("password", event.target.value)}
              className={authInputClassName}
            />
          )}
        </FormField>
      </div>

      <SignInActions isPending={isPending} isLocked={isLocked} />
    </form>
  );
}
