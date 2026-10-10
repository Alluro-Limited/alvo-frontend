import {Button} from "@alvo/ui";
import {AuthAlert} from "@/components/auth/auth-alert";
import {m} from "@/paraglide/messages";
import {AccountSetupFields} from "./account-setup-fields";
import {useAccountSetupForm} from "./use-account-setup-form";

interface AccountSetupFormProps {
  roleLabel: string;
}

export function AccountSetupForm({roleLabel}: AccountSetupFormProps) {
  const {values, fieldErrors, alert, setField, handleSubmit, isPending} = useAccountSetupForm();

  return (
    <form noValidate onSubmit={handleSubmit} className="flex w-full flex-col gap-8">
      {alert && <AuthAlert tone={alert.tone}>{alert.message}</AuthAlert>}
      <AccountSetupFields values={values} errors={fieldErrors} roleLabel={roleLabel} onFieldChange={setField} />
      <Button type="submit" isLoading={isPending} className="w-full text-base">
        {isPending ? m["account_setup.submitting"]() : m["account_setup.submit"]()}
      </Button>
    </form>
  );
}
