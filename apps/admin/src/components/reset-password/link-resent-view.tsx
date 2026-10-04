import {AuthAlert} from "@/components/auth/auth-alert";
import {AuthCard} from "@/components/auth/auth-card";
import {AuthStatusIcon} from "@/components/auth/auth-status-icon";
import {BackToSignInButton} from "@/components/auth/back-to-sign-in-button";
import {m} from "@/paraglide/messages";

interface LinkResentViewProps {
  maskedEmail: string;
}

export function LinkResentView({maskedEmail}: LinkResentViewProps) {
  return (
    <AuthCard
      wideHeader
      icon={<AuthStatusIcon tone="success" />}
      title={m["reset_password.resent.title"]()}
      description={m["reset_password.resent.description"]({maskedEmail})}
    >
      <div className="flex w-full flex-col gap-8">
        <AuthAlert tone="success">{m["reset_password.resent.alert"]()}</AuthAlert>
        <BackToSignInButton primary />
      </div>
    </AuthCard>
  );
}
