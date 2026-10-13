import {Link} from "@tanstack/react-router";
import {Button} from "@alvo/ui";
import {ErrorBanner} from "./error-banner";
import {m} from "@/paraglide/messages";

interface SignInFooterProps {
  error: boolean;
  busy: boolean;
  valid: boolean;
  onSubmit: () => void;
  onDismissError: () => void;
}

/** Bottom area: the wrong-password banner, Sign In button, and the sign-up prompt. */
export function SignInFooter({error, busy, valid, onSubmit, onDismissError}: SignInFooterProps) {
  return (
    <div className="mb-6 flex w-full flex-col gap-4 pb-[max(0px,env(safe-area-inset-bottom))]">
      {error ? <ErrorBanner onClose={onDismissError} /> : null}
      <Button className="w-full text-[16px] font-medium" variant={valid ? "default" : "disabled"} isLoading={busy} onClick={onSubmit}>
        {busy ? m["si.submitting"]() : m["si.submit"]()}
      </Button>
      <p className="flex items-center justify-center gap-1 text-[14px] leading-[1.4] tracking-[0.14px] whitespace-nowrap">
        <span className="text-grey-500">{m["si.no_account"]()}</span>
        <Link to="/sign-up" className="font-bold text-primary-500">
          {m["si.sign_up"]()}
        </Link>
      </p>
    </div>
  );
}
