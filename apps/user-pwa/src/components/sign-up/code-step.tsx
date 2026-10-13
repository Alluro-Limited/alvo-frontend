import {useState} from "react";
import {OtpInput} from "@/components/auth/otp-input";
import {ResendRow} from "./resend-row";
import {OTP_LENGTH, type VerificationMethod} from "@/types/auth-types";
import {m} from "@/paraglide/messages";

interface CodeStepProps {
  method: VerificationMethod;
  /** Masked destination shown in the subtitle, e.g. "+234 801 *** 5678". */
  destination: string;
  error: boolean;
  busy: boolean;
  onVerify: (code: string) => void;
  onResend: () => void;
  onChangeMethod: () => void;
}

/** Step 2b — the five-box code entry; verifies automatically once all digits are in. */
export function CodeStep({method, destination, error, busy, onVerify, onResend, onChangeMethod}: CodeStepProps) {
  const [code, setCode] = useState("");

  const subtitle =
    method === "email"
      ? m["su.code_email"]({dest: destination})
      : method === "whatsapp"
        ? m["su.code_whatsapp"]({dest: destination})
        : m["su.code_sms"]({dest: destination});

  const change = (value: string) => {
    setCode(value);
    if (value.length === OTP_LENGTH) onVerify(value);
  };

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <div className="flex w-full flex-col items-start gap-2">
        <h2 className="text-[32px] font-bold leading-[1.1] tracking-[-0.32px] text-foreground">{m["su.code_title"]()}</h2>
        <p className="text-[16px] leading-[1.4] tracking-[0.16px] text-grey-500">{subtitle}</p>
      </div>
      <OtpInput value={code} error={error} disabled={busy} onChange={change} />
      {error ? (
        <p className="w-full text-center text-[14px] leading-[1.4] tracking-[0.14px] text-status-fail">{m["su.code_wrong"]()}</p>
      ) : null}
      <ResendRow
        onResend={() => {
          setCode("");
          onResend();
        }}
        onChangeMethod={onChangeMethod}
      />
    </div>
  );
}
