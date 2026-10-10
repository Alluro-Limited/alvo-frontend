import {AuthCard} from "@/components/auth/auth-card";
import {ForgotPasswordForm} from "@/components/forgot-password/forgot-password-form";
import {m} from "@/paraglide/messages";

export function ForgotPasswordPage() {
  return (
    <AuthCard eyebrow={m["auth.recovery_eyebrow"]()} title={m["forgot_password.title"]()} description={m["forgot_password.description"]()}>
      <ForgotPasswordForm />
    </AuthCard>
  );
}
