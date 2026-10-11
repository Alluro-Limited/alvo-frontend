import {Button, PinInput} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import {AuthAlert} from "@/components/auth/auth-alert";
import {OTP_LENGTH} from "./sign-up-schema";
import {useVerifyEmailForm} from "./use-verify-email-form";
import {VerificationBanner} from "./verification-banner";

export function VerifyEmailForm() {
  const {code, banner, alert, handleCodeChange, handleSubmit, handleResend, isComplete, isPending, isLocked, isResending, isResent} =
    useVerifyEmailForm();

  return (
    <>
      {banner && <VerificationBanner title={banner.title}>{banner.body}</VerificationBanner>}
      <div className="flex w-full flex-col gap-8">
        <header className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl leading-[1.2] font-medium tracking-[-0.01em]">{m["sign_up.verify_title"]()}</h1>
          <p className="text-base leading-[1.4] tracking-[0.01em] text-foreground/50">{m["sign_up.verify_description"]()}</p>
        </header>
        <form noValidate onSubmit={handleSubmit} className="flex w-full flex-col items-center gap-6">
          {alert && <AuthAlert tone={alert.tone}>{alert.message}</AuthAlert>}
          <PinInput
            label={m["sign_up.verify_code_label"]()}
            length={OTP_LENGTH}
            variant="box"
            invalid={Boolean(banner)}
            value={code}
            onValueChange={handleCodeChange}
            disabled={isLocked}
            autoComplete="one-time-code"
          />
          <div className="flex w-full flex-col items-center gap-2">
            <Button type="submit" isLoading={isPending} disabled={!isComplete || isLocked} className="w-full text-base">
              {isPending ? m["sign_up.verify_submitting"]() : m["sign_up.verify_submit"]()}
            </Button>
            <p className="text-sm leading-[1.4] tracking-[0.01em]">
              {m["sign_up.no_code"]()}{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="font-medium text-primary-500 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isResending ? m["sign_up.resending"]() : isResent ? m["sign_up.resent"]() : m["sign_up.resend"]()}
              </button>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
