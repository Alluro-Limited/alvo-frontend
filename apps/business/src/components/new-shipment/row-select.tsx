import type {InputHTMLAttributes, ReactNode} from "react";
import {ChevronDown} from "lucide-react";
import {cn} from "cnfast";

export const FIELD_CLASS =
  "h-[41px] w-full rounded border-[0.75px] border-grey-300 bg-white px-2 text-xs leading-[1.4] font-medium tracking-[0.12px] text-black placeholder:text-grey-500";

export function invalidClass(invalid: boolean) {
  return invalid ? "border-status-fail" : "";
}

interface RowInputProps extends InputHTMLAttributes<HTMLInputElement> {
  ariaLabel: string;
  invalid: boolean;
}

/** Compact text input styled like the Figma row fields. */
export function RowInput({ariaLabel, invalid, className, ...props}: RowInputProps) {
  return (
    <input
      aria-label={ariaLabel}
      aria-invalid={invalid || undefined}
      className={cn(FIELD_CLASS, invalidClass(invalid), className)}
      {...props}
    />
  );
}

interface RowSelectProps {
  ariaLabel: string;
  value: string;
  invalid: boolean;
  onChange: (value: string) => void;
  children: ReactNode;
}

/** Compact native select styled like the Figma row fields, with a chevron affordance. */
export function RowSelect({ariaLabel, value, invalid, onChange, children}: RowSelectProps) {
  return (
    <div className="relative">
      <select
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(FIELD_CLASS, "appearance-none pr-6", invalidClass(invalid))}
      >
        {children}
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-grey-600" />
    </div>
  );
}
