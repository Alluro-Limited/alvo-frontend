import {useState} from "react";
import {useNavigate} from "@tanstack/react-router";
import {X} from "lucide-react";
import {Dialog, DialogBackdrop, DialogPopup, DialogPortal} from "@alvo/ui";
import {AppToast} from "@/components/app-toast";
import {OtpInput} from "@/components/sign-in/otp-input";
import {getErrorCode} from "@/lib/api-errors";
import {m} from "@/paraglide/messages";
import {useDeleteAccountMutation} from "@/queries/use-earnings-queries";
import {accountService} from "@/services/account-service";
import {OTP_LENGTH} from "@/types/auth-types";

interface DeleteOtpSheetProps {
  open: boolean;
  onClose: () => void;
}

/**
 * "Confirm account deletion" sheet — the courier re-verifies with a one-time code.
 * Confirm runs the deletion then lands on sign-in.
 */
export function DeleteOtpSheet({open, onClose}: DeleteOtpSheetProps) {
  const navigate = useNavigate();
  const deleteAccount = useDeleteAccountMutation();
  const [code, setCode] = useState("");
  const [error, setError] = useState<"wrong_code" | "failed" | null>(null);
  const resend = useDeleteCodeResend();

  const close = () => {
    setCode("");
    setError(null);
    onClose();
  };

  const confirm = () => {
    deleteAccount.mutate(code, {
      onSuccess: () => void navigate({to: "/sign-in"}),
      onError: (err) => setError(getErrorCode(err) === 400 ? "wrong_code" : "failed"),
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => !o && close()}>
        <DialogPortal>
          <DialogBackdrop />
          <DialogPopup className="top-auto bottom-0 left-0 w-full max-w-none translate-x-0 translate-y-0 rounded-t-[32px] rounded-b-none px-6 pt-3 pb-[max(24px,env(safe-area-inset-bottom))]">
            <div className="mx-auto h-[7px] w-14 rounded-full bg-grey-300" aria-hidden="true" />
            <DeleteOtpBody
              code={code}
              error={error !== null}
              failed={error === "failed"}
              busy={deleteAccount.isPending}
              onChange={(v) => {
                setCode(v);
                setError(null);
              }}
              onResend={resend.send}
              onConfirm={confirm}
              onClose={close}
            />
          </DialogPopup>
        </DialogPortal>
      </Dialog>
      {resend.toast && <AppToast message={m[resend.toast.key]()} variant={resend.toast.variant} onDismiss={resend.dismiss} />}
    </>
  );
}

type ResendToast = {key: "del.code_resent" | "del.request_failed"; variant: "success" | "destructive"};

/** Requests a fresh deletion code and reports the outcome via the resend toast. */
function useDeleteCodeResend() {
  const [toast, setToast] = useState<ResendToast | null>(null);
  const send = () =>
    accountService
      .requestDeleteCode()
      .then(() => setToast({key: "del.code_resent", variant: "success"}))
      .catch(() => setToast({key: "del.request_failed", variant: "destructive"}));
  return {send, toast, dismiss: () => setToast(null)};
}

interface DeleteOtpBodyProps {
  code: string;
  error: boolean;
  /** True when the deletion call failed for a non-code reason — generic error line. */
  failed: boolean;
  busy: boolean;
  onChange: (code: string) => void;
  onResend: () => void;
  onConfirm: () => void;
  onClose: () => void;
}

function DeleteOtpBody({code, error, failed, busy, onChange, onResend, onConfirm, onClose}: DeleteOtpBodyProps) {
  return (
    <>
      <div className="mt-7 flex items-center justify-between">
        <h2 className="text-[20px] font-medium">{m["del.sheet_title"]()}</h2>
        <button type="button" onClick={onClose} aria-label={m["home.cancel"]()} className="text-foreground">
          <X className="size-[18px]" aria-hidden="true" />
        </button>
      </div>
      <p className="mt-6 text-[16px] leading-[22px] text-grey-500">{m["del.sheet_desc"]()}</p>
      <div className="mt-5">
        <OtpInput value={code} error={error} disabled={busy} onChange={onChange} />
      </div>
      <p className="mt-3 flex gap-0.5 text-[12px]">
        <span className="text-grey-500">{m["del.resend_q"]()}</span>
        <button type="button" disabled={busy} onClick={onResend} className="text-primary-500 disabled:opacity-50">
          {m["del.resend"]()}
        </button>
      </p>
      {error && <p className="mt-2 text-[12px] text-status-fail">{failed ? m["del.request_failed"]() : m["del.err_code"]()}</p>}
      <div className="mt-8 flex gap-3">
        <button type="button" onClick={onClose} className="h-[50px] w-[165px] rounded-[8px] bg-grey-200 text-[16px] font-medium">
          {m["home.cancel"]()}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={code.length < OTP_LENGTH || busy}
          className="h-[50px] flex-1 rounded-[8px] bg-primary-500 text-[16px] font-medium text-white disabled:bg-grey-300 disabled:text-grey-500"
        >
          {busy ? m["del.confirming"]() : m["del.confirm"]()}
        </button>
      </div>
    </>
  );
}
