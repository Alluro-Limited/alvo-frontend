import {Button} from "@alvo/ui";
import {Link} from "@tanstack/react-router";
import {AuthAlert} from "@/components/auth/auth-alert";
import {AuthCard} from "@/components/auth/auth-card";
import {getAuthErrorMessage} from "@/components/auth/auth-errors";
import {AuthStatusIcon} from "@/components/auth/auth-status-icon";
import {BackToSignInButton} from "@/components/auth/back-to-sign-in-button";
import {useResendResetLinkMutation} from "@/queries/use-resend-reset-link-mutation";
import {m} from "@/paraglide/messages";

interface LinkExpiredViewProps {
  /** Missing when the link had no token at all; the user then starts over from forgot-password. */
  token?: string;
  onResent: (maskedEmail: string) => void;
}

export function LinkExpiredView({token, onResent}: LinkExpiredViewProps) {
  const mutation = useResendResetLinkMutation();
  function resend(resendToken: string) {
    mutation.mutate(resendToken, {onSuccess: ({maskedEmail}) => onResent(maskedEmail)});
  }

  return (
    <AuthCard
      wideHeader
      icon={<AuthStatusIcon tone="warning" />}
      title={m["reset_password.expired.title"]()}
      description={m["reset_password.expired.description"]()}
    >
      <div className="flex w-full flex-col gap-8">
        {mutation.error ? (
          <AuthAlert tone="error">{getAuthErrorMessage(mutation.error)}</AuthAlert>
        ) : (
          <AuthAlert tone="warning">{m["reset_password.expired.alert"]()}</AuthAlert>
        )}
        <div className="flex flex-col gap-4">
          {token ? (
            <Button type="button" onClick={() => resend(token)} isLoading={mutation.isPending} className="w-full text-base">
              {mutation.isPending ? m["reset_password.expired.resending"]() : m["reset_password.expired.resend"]()}
            </Button>
          ) : (
            <Button render={<Link to="/forgot-password" />} nativeButton={false} className="w-full text-base">
              {m["reset_password.expired.resend"]()}
            </Button>
          )}
          <BackToSignInButton variant="subtle" />
        </div>
      </div>
    </AuthCard>
  );
}
