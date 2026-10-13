import {useState} from "react";
import {X} from "lucide-react";
import {HTTPError} from "ky";
import {Button} from "@alvo/ui";
import {AuthSheet} from "@/components/auth/auth-sheet";
import {OtpInput} from "@/components/auth/otp-input";
import {LoadingDots} from "@/components/loading-dots";
import {useConfirmAccountDeletion, useResendDeletionCode} from "@/queries/use-account-queries";
import {OTP_LENGTH} from "@/types/auth-types";
import {m} from "@/paraglide/messages";

interface DeleteOtpSheetProps {
  open: boolean;
  onClose: () => void;
  /** Fired once the code verifies — the page navigates back to sign-in. */
  onDeleted: () => void;
}

function failed(err: Error) {
  return err instanceof HTTPError && (err.data as {code?: string} | undefined)?.code === "invalid_code";
}

/** "Confirm account deletion" sheet — the 5-digit code sent to the registered email/phone. */
export function DeleteOtpSheet({open, onClose, onDeleted}: DeleteOtpSheetProps) {
  const [code, setCode] = useState("");
  const resend = useResendDeletionCode();
  const confirm = useConfirmAccountDeletion();
  const wrongCode = confirm.isError && failed(confirm.error);

  const close = () => {
    setCode("");
    confirm.reset();
    onClose();
  };

  return (
    <AuthSheet open={open} onClose={close}>
      {confirm.isPending ? (
        <LoadingDots />
      ) : (
        <OtpForm
          code={code}
          wrongCode={wrongCode}
          resending={resend.isPending}
          onCode={(v) => {
            setCode(v);
            confirm.reset();
          }}
          onResend={() => resend.mutate()}
          onSubmit={() => confirm.mutate(code, {onSuccess: onDeleted})}
          onClose={close}
        />
      )}
    </AuthSheet>
  );
}

interface OtpFormProps {
  code: string;
  wrongCode: boolean;
  resending: boolean;
  onCode: (v: string) => void;
  onResend: () => void;
  onSubmit: () => void;
  onClose: () => void;
}

function OtpForm({code, wrongCode, resending, onCode, onResend, onSubmit, onClose}: OtpFormProps) {
  return (
    <div className="mt-2 flex w-full flex-col pb-4">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-[20px] font-medium leading-[1.2] text-foreground">{m["del.otp_title"]()}</h2>
        <button type="button" onClick={onClose} aria-label={m["loc.close"]()} className="flex size-8 items-center justify-center">
          <X className="size-[18px]" aria-hidden="true" />
        </button>
      </div>
      <p className="mt-2 text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">{m["del.otp_desc"]()}</p>
      <div className="mt-6 flex w-full flex-col gap-4">
        <OtpInput value={code} error={wrongCode} onChange={onCode} />
        {wrongCode ? <span className="text-[14px] leading-[1.4] tracking-[0.14px] text-status-fail">{m["del.otp_err"]()}</span> : null}
        <span className="text-[14px] leading-[1.4] tracking-[0.14px]">
          <span className="text-grey-500">{m["del.otp_resend_q"]()} </span>
          <button type="button" disabled={resending} onClick={onResend} className="font-medium text-primary-500 disabled:opacity-70">
            {m["del.otp_resend"]()}
          </button>
        </span>
      </div>
      <div className="mt-8 flex w-full gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex h-[50px] flex-1 items-center justify-center rounded-[12px] bg-[#f2f2f2] text-[16px] font-medium leading-[1.4] text-foreground"
        >
          {m["del.cancel"]()}
        </button>
        <Button className="h-[50px] flex-1 text-[16px] font-medium" disabled={code.length !== OTP_LENGTH} onClick={onSubmit}>
          {m["del.otp_confirm"]()}
        </Button>
      </div>
    </div>
  );
}
