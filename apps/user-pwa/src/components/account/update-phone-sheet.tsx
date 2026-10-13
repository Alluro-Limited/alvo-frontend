import {useState} from "react";
import {X} from "lucide-react";
import {HTTPError} from "ky";
import {Button} from "@alvo/ui";
import {AuthField} from "@/components/auth/auth-field";
import {AuthSheet} from "@/components/auth/auth-sheet";
import {OtpInput} from "@/components/auth/otp-input";
import {LoadingDots} from "@/components/loading-dots";
import {UpdatedView} from "./updated-view";
import {useSendPhoneVerification, useVerifyPhone} from "@/queries/use-account-queries";
import type {SimpleMessage} from "@/lib/i18n";
import {m} from "@/paraglide/messages";
import flagNgUrl from "@/assets/flag-ng.svg";

const CODE_LENGTH = 6;

/** "+234 901 234 5678" from the stored national digits. */
export function formatPhone(digits: string) {
  const national = digits.length === 11 && digits.startsWith("0") ? digits.slice(1) : digits;
  return `+234 ${national.slice(0, 3)} ${national.slice(3, 6)} ${national.slice(6)}`.trim();
}

/** Maps a send-verification rejection to the right inline error; `phone_in_use` wins over format. */
function phoneError(err: Error, setError: (e: SimpleMessage) => void) {
  const data = err instanceof HTTPError ? err.data : undefined;
  const code = typeof data === "object" && data !== null ? (data as {code?: string}).code : undefined;
  setError(code === "phone_in_use" ? "pi.phone_used" : "pi.phone_format");
}

interface UpdatePhoneSheetProps {
  open: boolean;
  phone: string | null;
  onClose: () => void;
}

type Step = "form" | "verify" | "done";

/** "Update Phone Number" sheet — new-number form → SMS OTP verify → updated success view. */
export function UpdatePhoneSheet({open, phone, onClose}: UpdatePhoneSheetProps) {
  const [step, setStep] = useState<Step>("form");
  const [nextPhone, setNextPhone] = useState("");
  const [error, setError] = useState<SimpleMessage | null>(null);
  const send = useSendPhoneVerification();
  const verify = useVerifyPhone();

  const close = () => {
    setStep("form");
    setNextPhone("");
    setError(null);
    onClose();
  };

  const submit = () => {
    const digits = nextPhone.replace(/\D/g, "");
    if (digits.length !== 10 && digits.length !== 11) {
      setError("pi.phone_format");
      return;
    }
    setError(null);
    send.mutate(digits, {
      onSuccess: () => setStep("verify"),
      onError: (err) => phoneError(err, setError),
    });
  };

  const pending = send.isPending || verify.isPending;
  return (
    <AuthSheet open={open} onClose={close}>
      {pending ? (
        <LoadingDots />
      ) : step === "form" ? (
        <PhoneForm current={phone} next={nextPhone} error={error} onNext={setNextPhone} onCancel={close} onSubmit={submit} />
      ) : step === "verify" ? (
        <PhoneVerify
          phone={nextPhone}
          onCancel={close}
          onVerified={() => setStep("done")}
          onResend={() => send.mutate(nextPhone.replace(/\D/g, ""))}
          verify={verify}
        />
      ) : (
        <UpdatedView title={m["pi.phone_done"]()} description={m["pi.phone_done_desc"]()} value={formatPhone(nextPhone)} onDone={close} />
      )}
    </AuthSheet>
  );
}

interface PhoneFormProps {
  current: string | null;
  next: string;
  error: SimpleMessage | null;
  onNext: (v: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

function PhoneForm({current, next, error, onNext, onCancel, onSubmit}: PhoneFormProps) {
  return (
    <div className="mt-2 flex w-full flex-col pb-4">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-[20px] font-medium leading-[1.2] text-foreground">{m["pi.phone_title"]()}</h2>
        <button type="button" onClick={onCancel} aria-label={m["loc.close"]()} className="flex size-8 items-center justify-center">
          <X className="size-[18px]" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-6 flex w-full flex-col gap-1.5 rounded-[12px] bg-[#f9f9f9] p-4">
        <span className="text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">{m["pi.current_phone"]()}</span>
        <span className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-foreground">{current ?? "-"}</span>
      </div>
      <div className="mt-4 flex flex-col gap-1">
        <AuthField
          id="pi-phone"
          label={m["pi.new_phone"]()}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={next}
          onChange={onNext}
          error={!!error}
          placeholder={m["su.phone_ph"]()}
          prefix={<img src={flagNgUrl} alt="" aria-hidden="true" className="h-4 w-[22px] shrink-0 rounded-[2px]" />}
        />
        {error ? <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-status-fail">{m[error]()}</span> : null}
      </div>
      <div className="mt-4 flex w-full flex-col gap-1 rounded-[12px] bg-[#f0fbfc] p-4">
        <span className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-foreground">{m["pi.notes_title"]()}</span>
        <ul className="flex list-disc flex-col gap-1 pl-4 text-[14px] leading-[1.4] tracking-[0.14px] text-grey-600">
          <li>{m["pi.note_sms"]()}</li>
          <li>{m["pi.note_active"]()}</li>
        </ul>
      </div>
      <div className="mt-6 flex w-full gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex h-[50px] flex-1 items-center justify-center rounded-[8px] bg-[#f2f2f2] text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-[#00221e]"
        >
          {m["pi.cancel"]()}
        </button>
        <Button className="flex-1 text-[14px] font-medium" disabled={!next.trim()} onClick={onSubmit}>
          {m["pi.send_code"]()}
        </Button>
      </div>
    </div>
  );
}

interface PhoneVerifyProps {
  phone: string;
  verify: ReturnType<typeof useVerifyPhone>;
  onCancel: () => void;
  onVerified: () => void;
  onResend: () => void;
}

function PhoneVerify({phone, verify, onCancel, onVerified, onResend}: PhoneVerifyProps) {
  const [code, setCode] = useState("");
  const [failed, setFailed] = useState(false);
  return (
    <div className="mt-2 flex w-full flex-col pb-4">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-[20px] font-medium leading-[1.2] text-foreground">{m["pi.verify_title"]()}</h2>
        <button type="button" onClick={onCancel} aria-label={m["loc.close"]()} className="flex size-8 items-center justify-center">
          <X className="size-[18px]" aria-hidden="true" />
        </button>
      </div>
      <p className="mt-2 text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">
        {m["pi.verify_desc"]()} <span className="font-medium text-primary-500">{formatPhone(phone)}</span>
      </p>
      <div className="mt-6 flex w-full flex-col items-start gap-3">
        <OtpInput value={code} length={CODE_LENGTH} error={failed} onChange={setCode} />
        <span className="text-[14px] leading-[1.4] tracking-[0.14px]">
          <span className="text-grey-500">{m["acc.resend_q"]()} </span>
          <button type="button" onClick={onResend} className="font-medium text-primary-500">
            {m["acc.resend_link"]()}
          </button>
        </span>
      </div>
      <div className="mt-auto flex w-full gap-3 pt-8">
        <button
          type="button"
          onClick={onCancel}
          className="flex h-[50px] flex-1 items-center justify-center rounded-[8px] bg-[#f2f2f2] text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-[#00221e]"
        >
          {m["pi.cancel"]()}
        </button>
        <Button
          className="flex-1 text-[14px] font-medium"
          disabled={code.length !== CODE_LENGTH}
          onClick={() => verify.mutate(code, {onSuccess: onVerified, onError: () => setFailed(true)})}
        >
          {m["acc.verify"]()}
        </Button>
      </div>
    </div>
  );
}
