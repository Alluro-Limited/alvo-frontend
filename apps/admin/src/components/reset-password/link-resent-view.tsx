import {AuthAlert} from "@/components/auth/auth-alert";
import {AuthCard} from "@/components/auth/auth-card";
import {AuthStatusIcon} from "@/components/auth/auth-status-icon";
import {BackToSignInButton} from "@/components/auth/back-to-sign-in-button";
import {m} from "@/paraglide/messages";

interface LinkResentViewProps {
  maskedEmail: string;
}

/** Keeps the sentence as one translatable message and only colours the address inside it. */
function ResentDescription({maskedEmail}: LinkResentViewProps) {
  const [before, ...after] = m["reset_password.resent.description"]({maskedEmail}).split(maskedEmail);
  return (
    <>
      {before}
      <span className="text-primary-500">{maskedEmail}</span>
      {after.join(maskedEmail)}
    </>
  );
}

export function LinkResentView({maskedEmail}: LinkResentViewProps) {
  return (
    <AuthCard
      wideHeader
      icon={<AuthStatusIcon tone="success" />}
      title={m["reset_password.resent.title"]()}
      description={<ResentDescription maskedEmail={maskedEmail} />}
    >
      <div className="flex w-full flex-col gap-8">
        <AuthAlert tone="success">{m["reset_password.resent.alert"]()}</AuthAlert>
        <BackToSignInButton variant="primary">{m["auth.sign_in_with_new_password"]()}</BackToSignInButton>
      </div>
    </AuthCard>
  );
}
