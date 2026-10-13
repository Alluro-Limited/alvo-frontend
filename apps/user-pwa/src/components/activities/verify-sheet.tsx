import {useEffect, useState} from "react";
import {X} from "lucide-react";
import {Button} from "@alvo/ui";
import {AuthSheet} from "@/components/auth/auth-sheet";
import {OtpInput} from "@/components/auth/otp-input";
import {useSendPickupVerification, useVerifyPickup} from "@/queries/use-activity-queries";
import {m} from "@/paraglide/messages";

const CODE_LENGTH = 6;

interface VerifySheetProps {
  open: boolean;
  deliveryId: string;
  onClose: () => void;
}

/** "Security Verification" sheet — 6-digit email OTP that unmasks the safe pickup code. */
export function VerifySheet({open, deliveryId, onClose}: VerifySheetProps) {
  const [code, setCode] = useState("");
  const [failed, setFailed] = useState(false);
  const send = useSendPickupVerification(deliveryId);
  const verify = useVerifyPickup(deliveryId);

  const {mutate} = send;
  useEffect(() => {
    if (open) mutate();
  }, [open, mutate]);

  const close = () => {
    setCode("");
    setFailed(false);
    onClose();
  };

  const submit = () => {
    if (code.length !== CODE_LENGTH) return;
    verify.mutate(code, {onSuccess: close, onError: () => setFailed(true)});
  };

  return (
    <AuthSheet open={open} onClose={close}>
      {verify.isPending ? (
        <div className="flex h-64 w-full items-center justify-center gap-2" aria-busy="true" role="status">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-2.5 animate-pulse rounded-full bg-grey-400" />
          ))}
        </div>
      ) : (
        <VerifyForm
          code={code}
          failed={failed}
          onCode={setCode}
          onResend={() => {
            setCode("");
            setFailed(false);
            send.mutate();
          }}
          onSubmit={submit}
          onClose={close}
        />
      )}
    </AuthSheet>
  );
}

interface VerifyFormProps {
  code: string;
  failed: boolean;
  onCode: (v: string) => void;
  onResend: () => void;
  onSubmit: () => void;
  onClose: () => void;
}

function VerifyForm({code, failed, onCode, onResend, onSubmit, onClose}: VerifyFormProps) {
  return (
    <div className="mt-2 flex w-full flex-col pb-4">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-[20px] font-medium leading-[1.2] text-foreground">{m["acc.verify_title"]()}</h2>
        <button type="button" onClick={onClose} aria-label={m["loc.close"]()} className="flex size-8 items-center justify-center">
          <X className="size-[18px]" aria-hidden="true" />
        </button>
      </div>
      <p className="mt-2 text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">{m["acc.verify_desc"]()}</p>
      <div className="mt-6 flex w-full flex-col items-center gap-6">
        <OtpInput value={code} length={CODE_LENGTH} error={failed} onChange={onCode} />
        {failed ? (
          <div className="flex w-full flex-col gap-1 text-center">
            <span className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-foreground">{m["acc.verify_err_title"]()}</span>
            <span className="text-[14px] leading-[1.4] tracking-[0.14px] text-status-fail">{m["acc.verify_err"]()}</span>
          </div>
        ) : null}
        <span className="text-[14px] leading-[1.4] tracking-[0.14px]">
          <span className="text-grey-500">{m["acc.resend_q"]()} </span>
          <button type="button" onClick={onResend} className="font-medium text-primary-500 underline">
            {m["acc.resend_link"]()}
          </button>
        </span>
      </div>
      <Button className="mt-6 w-full text-[16px] font-medium" disabled={code.length !== CODE_LENGTH} onClick={onSubmit}>
        {m["acc.verify"]()}
      </Button>
    </div>
  );
}
