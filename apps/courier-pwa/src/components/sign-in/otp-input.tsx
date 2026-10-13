import {useState} from "react";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import {OTP_LENGTH} from "@/types/auth-types";

interface OtpInputProps {
  value: string;
  /** Red boxes + tint when the backend rejected the code. */
  error: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
}

/**
 * The five 50px code boxes from the design. One invisible input covers the whole row so
 * typing, backspace, paste and SMS autofill all work through a single field; the boxes are
 * purely visual digits.
 */
export function OtpInput({value, error, disabled, onChange}: OtpInputProps) {
  const [focused, setFocused] = useState(false);
  const active = Math.min(value.length, OTP_LENGTH - 1);

  return (
    <div className="relative flex gap-3">
      {Array.from({length: OTP_LENGTH}, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={cn(
            "flex size-[50px] items-center justify-center rounded-[10px] border text-[18px] font-semibold",
            error
              ? "border-danger-500 bg-danger-50 text-foreground"
              : cn("border-grey-300 bg-white text-foreground", focused && i === active && "border-primary-500 ring-2 ring-primary-500/20")
          )}
        >
          {value[i] ?? ""}
        </span>
      ))}
      <input
        aria-label={m["auth.code_label"]()}
        autoComplete="one-time-code"
        className="absolute inset-0 h-full w-full cursor-text opacity-0"
        disabled={disabled}
        inputMode="numeric"
        maxLength={OTP_LENGTH}
        value={value}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH))}
        onFocus={() => setFocused(true)}
      />
    </div>
  );
}
