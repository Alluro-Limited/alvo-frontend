import {useEffect, useState} from "react";
import {CircleCheck} from "lucide-react";
import {m} from "@/paraglide/messages";

const RESEND_SECONDS = 60;
const TOAST_MS = 2500;

interface ResendCodeProps {
  /** Fires the resend mutation; the countdown only restarts when it resolves. */
  onResend: () => Promise<void>;
  pending: boolean;
}

/**
 * "Didn't receive a code?" row: a teal Resend code button that swaps to a greyed
 * "Resend in M:SS" countdown, plus the "Code resent" toast pill after a successful resend.
 */
export function ResendCode({onResend, pending}: ResendCodeProps) {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [toast, setToast] = useState(false);
  const counting = secondsLeft > 0;

  useEffect(() => {
    if (!counting) return;
    const timer = setTimeout(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(timer);
  }, [counting]);

  const resend = async () => {
    try {
      await onResend();
      setSecondsLeft(RESEND_SECONDS);
      setToast(true);
      setTimeout(() => setToast(false), TOAST_MS);
    } catch {
      /* resend failures are rare and leave the button available to try again */
    }
  };

  const mm = Math.floor(secondsLeft / 60);
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <>
      <p className="text-[14px] leading-[20px] text-foreground">
        {m["auth.no_code"]()}{" "}
        {secondsLeft > 0 ? (
          <span className="font-semibold text-grey-500">{`${m["auth.resend_in"]()} ${mm}:${ss}`}</span>
        ) : (
          <button type="button" onClick={resend} disabled={pending} className="font-semibold text-primary-500 disabled:opacity-50">
            {m["auth.resend"]()}
          </button>
        )}
      </p>
      {toast && (
        <p
          role="status"
          className="fixed bottom-36 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-[10px] border border-grey-200 bg-white px-4 py-3 text-[14px] font-semibold text-foreground shadow-sm"
        >
          <CircleCheck className="size-5 text-primary-500" aria-hidden="true" />
          {m["auth.code_resent"]()}
        </p>
      )}
    </>
  );
}
