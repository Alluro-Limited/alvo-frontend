import {AuthCard} from "@/components/auth/auth-card";
import {AuthStatusIcon} from "@/components/auth/auth-status-icon";
import {BackToSignInButton} from "@/components/auth/back-to-sign-in-button";
import {m} from "@/paraglide/messages";

export function PasswordUpdatedView() {
  return (
    <AuthCard
      icon={<AuthStatusIcon tone="success" />}
      title={m["reset_password.updated.title"]()}
      description={m["reset_password.updated.description"]()}
    >
      <BackToSignInButton primary />
    </AuthCard>
  );
}
