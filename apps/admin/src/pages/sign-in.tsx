import {AuthCard} from "@/components/auth/auth-card";
import {SignInForm} from "@/components/sign-in/sign-in-form";
import {m} from "@/paraglide/messages";

export function SignInPage() {
  return (
    <AuthCard eyebrow={m["sign_in.portal"]()} title={m["sign_in.title"]()} description={m["sign_in.description"]()}>
      <SignInForm />
    </AuthCard>
  );
}
