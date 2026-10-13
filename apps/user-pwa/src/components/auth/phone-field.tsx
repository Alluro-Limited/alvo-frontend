import {AuthField} from "./auth-field";
import flagNgUrl from "@/assets/flag-ng.svg";
import {m} from "@/paraglide/messages";

interface PhoneFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

/** Nigerian phone input — flag + `+234` prefix inside the box, digits only. */
export function PhoneField({id, label, value, onChange}: PhoneFieldProps) {
  return (
    <AuthField
      id={id}
      label={label}
      type="tel"
      inputMode="numeric"
      autoComplete="tel-national"
      value={value}
      onChange={(v) => onChange(v.replace(/\D/g, "").slice(0, 11))}
      placeholder={m["su.phone_ph"]()}
      prefix={
        <span className="flex shrink-0 items-center gap-1.5 text-[14px] tracking-[0.14px] text-foreground">
          <img src={flagNgUrl} alt="" aria-hidden="true" className="h-4 w-[22px] rounded-[2px]" />
          +234
        </span>
      }
    />
  );
}
