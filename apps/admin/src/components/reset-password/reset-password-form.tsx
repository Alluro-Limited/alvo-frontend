import {Button} from "@alvo/ui";
import {AuthAlert} from "@/components/auth/auth-alert";
import {m} from "@/paraglide/messages";
import {ResetPasswordFields} from "./reset-password-fields";
import {useResetPasswordForm} from "./use-reset-password-form";

interface ResetPasswordFormProps {
  token: string;
  onUpdated: () => void;
  onExpired: () => void;
}

export function ResetPasswordForm(props: ResetPasswordFormProps) {
  const {values, alert, canSubmit, isLocked, setField, handleSubmit, isPending} = useResetPasswordForm(props);

  return (
    <form noValidate onSubmit={handleSubmit} className="flex w-full flex-col gap-8">
      {alert && <AuthAlert tone={alert.tone}>{alert.message}</AuthAlert>}
      <ResetPasswordFields values={values} onChange={setField} />
      {/* Figma keeps the button greyed out until every rule passes and the confirmation is filled. */}
      <Button
        type="submit"
        isLoading={isPending}
        disabled={!canSubmit || isLocked}
        variant={canSubmit ? "default" : "disabled"}
        className="w-full text-base"
      >
        {isPending ? m["reset_password.submitting"]() : m["reset_password.submit"]()}
      </Button>
    </form>
  );
}
