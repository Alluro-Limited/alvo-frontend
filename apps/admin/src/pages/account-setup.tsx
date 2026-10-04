import {AuthAlert} from "@/components/auth/auth-alert";
import {AuthCard} from "@/components/auth/auth-card";
import {BackToSignInButton} from "@/components/auth/back-to-sign-in-button";
import {getAuthErrorMessage} from "@/components/auth/auth-errors";
import {HighlightedText} from "@/components/auth/highlighted-text";
import {AccountSetupForm} from "@/components/account-setup/account-setup-form";
import {AccountSetupSkeleton} from "@/components/account-setup/account-setup-skeleton";
import {useAccountSetupQuery} from "@/queries/use-account-setup-query";
import {m} from "@/paraglide/messages";

export function AccountSetupPage() {
  const {data, isPending, error} = useAccountSetupQuery();

  const description = data ? (
    <HighlightedText
      text={m["account_setup.description"]({invitedBy: data.invitedBy})}
      highlight={data.invitedBy}
      className="font-bold text-primary-700"
    />
  ) : (
    m["account_setup.description_fallback"]()
  );

  return (
    <AuthCard wideHeader eyebrow={m["account_setup.eyebrow"]()} title={m["account_setup.title"]()} description={description}>
      {isPending && <AccountSetupSkeleton />}
      {error && (
        <div className="flex w-full flex-col gap-8">
          <AuthAlert tone="error">{getAuthErrorMessage(error)}</AuthAlert>
          <BackToSignInButton />
        </div>
      )}
      {data && <AccountSetupForm roleLabel={data.roleLabel} />}
    </AuthCard>
  );
}
