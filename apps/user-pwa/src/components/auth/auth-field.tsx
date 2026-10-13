import type {HTMLInputTypeAttribute, InputHTMLAttributes, ReactNode} from "react";
import {cn} from "cnfast";

const inputBox =
  "flex w-full items-center gap-2 overflow-clip rounded-[8px] border-[0.75px] px-4 py-3.5 transition-colors focus-within:border-primary-500";
const inputText =
  "min-w-0 flex-1 bg-transparent text-[14px] leading-[1.4] tracking-[0.14px] text-foreground placeholder:text-grey-500 focus:outline-none";

interface AuthFieldProps {
  id: string;
  label: string;
  error?: boolean;
  /** Trailing content inside the input box (eye toggle, flag prefix lives on the left via `prefix`). */
  prefix?: ReactNode;
  suffix?: ReactNode;
  type?: HTMLInputTypeAttribute;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
}

/** Label + bordered input row used across the auth screens; red border in the error state. */
export function AuthField({
  id,
  label,
  error,
  prefix,
  suffix,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  inputMode,
  maxLength,
}: AuthFieldProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={id} className="text-[16px] leading-[1.4] tracking-[0.16px] text-primary-800">
        {label}
      </label>
      <div className={cn(inputBox, error ? "border-status-fail" : "border-grey-300")}>
        {prefix}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          className={inputText}
        />
        {suffix}
      </div>
    </div>
  );
}
