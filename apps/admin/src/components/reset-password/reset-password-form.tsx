import {Button} from "@alvo/ui";
import {AuthAlert} from "@/components/auth/auth-alert";
import {authInputClassName} from "@/components/auth/auth-input-styles";
import {FormField} from "@/components/auth/form-field";
import {PasswordInput} from "@/components/auth/password-input";
import {m} from "@/paraglide/messages";
import {PasswordRequirements} from "./password-requirements";
import {useResetPasswordForm} from "./use-reset-password-form";

interface ResetPasswordFormProps {
  token: string;
  onUpdated: () => void;
  onExpired: () => void;
}

export function ResetPasswordForm(props: ResetPasswordFormProps) {
  const {values, fieldErrors, errorMessage, setField, handleSubmit, isPending} = useResetPasswordForm(props);

  return (
    <form noValidate onSubmit={handleSubmit} className="flex w-full flex-col gap-8">
      {errorMessage && <AuthAlert tone="error">{errorMessage}</AuthAlert>}

      <div className="flex flex-col gap-6">
        <FormField label={m["reset_password.password_label"]()} error={fieldErrors.password}>
          {(control) => (
            <PasswordInput
              {...control}
              name="new-password"
              autoComplete="new-password"
              placeholder={m["reset_password.password_placeholder"]()}
              value={values.password}
              onChange={(event) => setField("password", event.target.value)}
              className={authInputClassName}
            />
          )}
        </FormField>
        <div className="flex flex-col gap-3">
          <FormField label={m["reset_password.confirm_label"]()} error={fieldErrors.confirmPassword}>
            {(control) => (
              <PasswordInput
                {...control}
                name="confirm-password"
                autoComplete="new-password"
                placeholder={m["reset_password.confirm_placeholder"]()}
                value={values.confirmPassword}
                onChange={(event) => setField("confirmPassword", event.target.value)}
                className={authInputClassName}
              />
            )}
          </FormField>
          <PasswordRequirements password={values.password} />
        </div>
      </div>

      <Button type="submit" isLoading={isPending} className="w-full text-base">
        {isPending ? m["reset_password.submitting"]() : m["reset_password.submit"]()}
      </Button>
    </form>
  );
}
