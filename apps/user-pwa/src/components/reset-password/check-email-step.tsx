import {useState} from "react";
import {OtpInput} from "@/components/auth/otp-input";
import envelopeIconUrl from "@/assets/icon-envelope.svg";
import {m} from "@/paraglide/messages";
import {OTP_LENGTH} from "@/types/auth-types";

interface CheckEmailStepProps {
  maskedEmail: string;
  error: boolean;
  busy: boolean;
  code: string;
  onCode: (value: string) => void;
  onResend: () => void;
}

/** Reset step 2 — envelope icon, "Check Your Email", and the five-box code entry. */
export function CheckEmailStep({maskedEmail, error, busy, code, onCode, onResend}: CheckEmailStepProps) {
  const [resent, setResent] = useState(false);

  const resend = () => {
    setResent(true);
    onResend();
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <img src={envelopeIconUrl} alt="" aria-hidden="true" className="size-[62px]" />
      <div className="flex w-full flex-col gap-2">
        <h1 className="text-[32px] font-bold leading-[1.1] tracking-[-0.32px] text-foreground">{m["rp.check_title"]()}</h1>
        <p className="text-[16px] leading-[1.4] tracking-[0.16px] text-grey-500">
          {m["rp.check_desc_pre"]()} <span className="font-medium text-primary-500">{maskedEmail}</span>
          {m["rp.check_desc_post"]()}
        </p>
      </div>
      <OtpInput value={code} error={error} disabled={busy} onChange={(v) => onCode(v.slice(0, OTP_LENGTH))} />
      {error ? <p className="text-[14px] leading-[1.4] tracking-[0.14px] text-status-fail">{m["su.code_wrong"]()}</p> : null}
      <p className="flex items-center gap-1 text-[14px] leading-[1.4] tracking-[0.14px]">
        <span className="text-grey-500">{m["rp.no_email"]()}</span>
        <button type="button" onClick={resend} className="font-medium text-primary-500">
          {resent ? m["rp.resent"]() : m["rp.resend"]()}
        </button>
      </p>
    </div>
  );
}
