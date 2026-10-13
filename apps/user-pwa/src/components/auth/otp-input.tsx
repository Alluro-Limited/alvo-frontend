import {useState} from "react";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import {OTP_LENGTH} from "@/types/auth-types";

interface OtpInputProps {
  value: string;
  /** Red boxes when the backend rejected the code. */
  error?: boolean;
  disabled?: boolean;
  /** Box count — defaults to the auth OTP length; the safe pickup verification uses 6. */
  length?: number;
  onChange: (value: string) => void;
}

/**
 * The five 50px code boxes from the design. One invisible input covers the whole row so
 * typing, backspace, paste and SMS autofill all work through a single field; the boxes are
 * purely visual digits.
 */
export function OtpInput({value, error, disabled, length = OTP_LENGTH, onChange}: OtpInputProps) {
  const [focused, setFocused] = useState(false);
  const active = Math.min(value.length, length - 1);

  return (
    <div className="relative flex gap-3">
      {Array.from({length}, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={cn(
            "flex size-[50px] items-center justify-center rounded-[4px] border bg-grey-100 text-[16px] font-medium tracking-[0.16px] text-foreground shadow-[0px_2px_8px_0px_rgba(6,127,138,0.05)]",
            error
              ? "border-status-fail"
              : cn(
                  "border-grey-400",
                  i < value.length && "border-primary-500 shadow-[0px_2px_8px_0px_rgba(6,127,138,0.12)]",
                  focused && i === active && "border-primary-500"
                )
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
        maxLength={length}
        value={value}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, length))}
        onFocus={() => setFocused(true)}
      />
    </div>
  );
}
