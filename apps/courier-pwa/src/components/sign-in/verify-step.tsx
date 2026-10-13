import type {SimpleMessage} from "@/lib/i18n";
import {m} from "@/paraglide/messages";
import {OtpInput} from "./otp-input";
import {ResendCode} from "./resend-code";
import {TooManyAlert} from "./too-many-alert";

interface VerifyStepProps {
  phone: string;
  code: string;
  error: SimpleMessage | null;
  rateLimited: boolean;
  pending: boolean;
  resend: () => Promise<void>;
  resendPending: boolean;
  onCodeChange: (code: string) => void;
}

/** Step 2: the 5-digit SMS code; auto-submits when the last digit lands. */
export function VerifyStep({phone, code, error, rateLimited, pending, resend, resendPending, onCodeChange}: VerifyStepProps) {
  return (
    <div className="flex flex-1 flex-col pb-6">
      <h1 className="text-[30px] leading-[36px] font-bold tracking-[-0.01em]">{m["auth.verify_title"]()}</h1>
      <p className="mt-3 text-[16px] leading-[22px] text-grey-500">
        {m["auth.code_sent"]()} <span className="text-primary-500">+234 XXX XXX {phone.slice(-4)}</span>
      </p>
      <div className="mt-10">
        <OtpInput value={code} error={error !== null || rateLimited} disabled={pending || rateLimited} onChange={onCodeChange} />
        {error && <p className="mt-2 text-[13px] leading-[17px] text-danger-500">{m[error]()}</p>}
      </div>
      <div className="mt-10">
        <ResendCode onResend={resend} pending={resendPending} />
      </div>
      {rateLimited && (
        <div className="mt-auto pt-10">
          <TooManyAlert />
        </div>
      )}
    </div>
  );
}
