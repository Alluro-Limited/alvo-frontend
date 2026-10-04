import {useState} from "react";
import {AuthCard} from "@/components/auth/auth-card";
import {LinkExpiredView} from "@/components/reset-password/link-expired-view";
import {LinkResentView} from "@/components/reset-password/link-resent-view";
import {PasswordUpdatedView} from "@/components/reset-password/password-updated-view";
import {ResetPasswordForm} from "@/components/reset-password/reset-password-form";
import {m} from "@/paraglide/messages";

type ResetPasswordView = {name: "form"} | {name: "updated"} | {name: "expired"} | {name: "resent"; maskedEmail: string};

interface ResetPasswordPageProps {
  /** From the recovery link (`/reset-password?token=…`). Without one, the link is treated as expired. */
  token?: string;
}

export function ResetPasswordPage({token}: ResetPasswordPageProps) {
  const [view, setView] = useState<ResetPasswordView>({name: "form"});

  if (view.name === "updated") return <PasswordUpdatedView />;
  if (view.name === "resent") return <LinkResentView maskedEmail={view.maskedEmail} />;
  if (view.name === "expired" || !token) {
    return <LinkExpiredView token={token} onResent={(maskedEmail) => setView({name: "resent", maskedEmail})} />;
  }

  return (
    <AuthCard eyebrow={m["auth.recovery_eyebrow"]()} title={m["reset_password.title"]()} description={m["reset_password.description"]()}>
      <ResetPasswordForm token={token} onUpdated={() => setView({name: "updated"})} onExpired={() => setView({name: "expired"})} />
    </AuthCard>
  );
}
