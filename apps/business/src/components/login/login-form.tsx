import {Button, Input} from "@alvo/ui";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import {AuthAlert} from "@/components/auth/auth-alert";
import {FormField} from "@/components/auth/form-field";
import {PasswordInput} from "@/components/auth/password-input";
import {authInputClassName} from "@/components/auth/auth-input-styles";
import {useLoginForm} from "./use-login-form";

export function LoginForm() {
  const {values, fieldErrors, alert, setField, handleSubmit, isPending, isLocked} = useLoginForm();

  return (
    <form noValidate onSubmit={handleSubmit} className="flex w-full flex-col gap-8">
      {alert && <AuthAlert tone={alert.tone}>{alert.message}</AuthAlert>}

      <div className="flex flex-col gap-4">
        <FormField label={m["login.email_label"]()} error={fieldErrors.email}>
          {(control) => (
            <Input
              {...control}
              type="email"
              name="email"
              autoComplete="username"
              placeholder={m["login.email_placeholder"]()}
              value={values.email}
              onChange={(event) => setField("email", event.target.value)}
              className={cn(authInputClassName, "text-sm")}
            />
          )}
        </FormField>
        <FormField label={m["login.password_label"]()} error={fieldErrors.password}>
          {(control) => (
            <PasswordInput
              {...control}
              name="password"
              autoComplete="current-password"
              placeholder={m["login.password_placeholder"]()}
              value={values.password}
              onChange={(event) => setField("password", event.target.value)}
              className={authInputClassName}
            />
          )}
        </FormField>
      </div>

      <Button type="submit" isLoading={isPending} disabled={isLocked} className="w-full text-base">
        {isPending ? m["login.submitting"]() : m["login.submit"]()}
      </Button>
    </form>
  );
}
