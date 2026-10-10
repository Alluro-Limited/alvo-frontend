import {Button, Input} from "@alvo/ui";
import {cn} from "cnfast";
import {AuthAlert} from "@/components/auth/auth-alert";
import {authInputClassName} from "@/components/auth/auth-input-styles";
import {BackToSignInButton} from "@/components/auth/back-to-sign-in-button";
import {FormField} from "@/components/auth/form-field";
import {m} from "@/paraglide/messages";
import {useForgotPasswordForm} from "./use-forgot-password-form";

export function ForgotPasswordForm() {
  const {email, emailError, alert, setEmail, handleSubmit, isPending} = useForgotPasswordForm();

  return (
    <form noValidate onSubmit={handleSubmit} className="flex w-full flex-col gap-8">
      {alert && <AuthAlert tone={alert.tone}>{alert.message}</AuthAlert>}

      <FormField label={m["auth.email_label"]()} error={emailError}>
        {(control) => (
          <Input
            {...control}
            type="email"
            name="email"
            autoComplete="username"
            placeholder={m["forgot_password.email_placeholder"]()}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={cn(authInputClassName, "text-sm")}
          />
        )}
      </FormField>

      <div className="flex flex-col gap-4">
        <Button type="submit" isLoading={isPending} className="w-full text-base">
          {isPending ? m["forgot_password.submitting"]() : m["forgot_password.submit"]()}
        </Button>
        <BackToSignInButton />
      </div>
    </form>
  );
}
