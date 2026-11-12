import {Button, PinInput} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import {AuthAlert} from "@/components/auth/auth-alert";
import type {SignInChallenge} from "@/types/auth-types";
import {useTwoFactorForm} from "./use-two-factor-form";

interface TwoFactorFormProps {
  challenge: SignInChallenge;
}

/**
 * The second factor of admin sign-in (and of account setup): a 6-digit authenticator
 * code. When the challenge carries an enrollment, the secret renders for manual
 * entry into the authenticator app first.
 */
export function TwoFactorForm({challenge}: TwoFactorFormProps) {
  const {code, alert, handleCodeChange, handleSubmit, isComplete, isPending, isLocked} = useTwoFactorForm(challenge);
  const {enrollment} = challenge;

  return (
    <div className="flex w-full flex-col gap-8">
      <header className="flex flex-col items-center gap-1 text-center">
        <h2 className="text-xl leading-[1.2] font-medium tracking-[-0.01em]">
          {enrollment ? m["sign_in.totp.enroll_title"]() : m["sign_in.totp.title"]()}
        </h2>
        <p className="text-sm leading-[1.4] tracking-[0.01em] text-foreground/50">
          {enrollment ? m["sign_in.totp.enroll_description"]() : m["sign_in.totp.description"]()}
        </p>
      </header>
      <form noValidate onSubmit={handleSubmit} className="flex w-full flex-col items-center gap-6">
        {alert && <AuthAlert tone={alert.tone}>{alert.message}</AuthAlert>}
        {enrollment && (
          <div className="w-full rounded-lg border border-grey-300 bg-grey-100 px-4 py-3">
            <p className="text-xs leading-[1.4] font-medium tracking-[0.14px] text-grey-600">{m["sign_in.totp.secret_label"]()}</p>
            <p className="mt-1 font-mono text-sm leading-[1.4] tracking-[0.14px] break-all">{enrollment.secret}</p>
          </div>
        )}
        <PinInput
          label={m["sign_in.totp.code_label"]()}
          length={6}
          variant="box"
          value={code}
          onValueChange={handleCodeChange}
          disabled={isLocked}
          autoComplete="one-time-code"
        />
        <Button type="submit" isLoading={isPending} disabled={!isComplete || isLocked} className="w-full text-base">
          {isPending ? m["sign_in.totp.submitting"]() : m["sign_in.totp.submit"]()}
        </Button>
      </form>
    </div>
  );
}
