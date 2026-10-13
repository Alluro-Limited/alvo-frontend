import {useState} from "react";
import {useNavigate} from "@tanstack/react-router";
import {AuthHeader} from "@/components/auth/auth-header";
import {LoginSuccess} from "@/components/sign-in/login-success";
import {SignInFields} from "@/components/sign-in/sign-in-fields";
import {SignInFooter} from "@/components/sign-in/sign-in-footer";
import {m} from "@/paraglide/messages";
import {authService} from "@/services/auth-service";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** "Welcome Back" — email + password sign-in with the designed wrong-password banner. */
export function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState<string | null>(null);

  const valid = EMAIL_RE.test(email) && password.length > 0;

  const submit = async () => {
    setBusy(true);
    setError(false);
    try {
      const result = await authService.signIn(email, password);
      setName(result.name);
    } catch {
      setError(true);
    }
    setBusy(false);
  };

  if (name !== null) return <LoginSuccess name={name} />;

  return (
    <main className="flex h-dvh w-full flex-col bg-white px-6 pt-[65px]">
      <AuthHeader onBack={() => void navigate({to: "/onboarding"})} />
      <div className="mt-[26px] flex flex-1 flex-col gap-8 overflow-y-auto pb-4">
        <div className="flex w-full flex-col gap-2">
          <h1 className="text-[32px] font-bold leading-[1.1] tracking-[-0.32px] text-foreground">{m["si.title"]()}</h1>
          <p className="text-[16px] leading-[1.4] tracking-[0.16px] text-grey-500">{m["si.desc"]()}</p>
        </div>
        <SignInFields email={email} password={password} error={error} onEmail={setEmail} onPassword={setPassword} />
      </div>
      <SignInFooter error={error} busy={busy} valid={valid} onSubmit={() => void submit()} onDismissError={() => setError(false)} />
    </main>
  );
}
