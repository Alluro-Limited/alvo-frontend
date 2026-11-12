import {useState} from "react";
import {ChevronDown} from "lucide-react";
import {cn} from "cnfast";
import {getCountryCallingCode, parsePhoneNumber, type CountryCode} from "libphonenumber-js";
import {
  Input,
  Select,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPopup,
  SelectPortal,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import {FormField, type FormFieldControlProps} from "@/components/auth/form-field";
import {authInputClassName} from "@/components/auth/auth-input-styles";
import {countryOptions, DEFAULT_COUNTRY, flagEmoji} from "./country-options";

const selectItems = countryOptions.map((option) => ({value: option.value, label: option.name}));

/** `parsePhoneNumber` throws on unparseable input; the field treats that as "no number yet". */
function tryParse(text: string, country?: CountryCode) {
  if (!text) return undefined;
  try {
    return parsePhoneNumber(text, country);
  } catch {
    return undefined;
  }
}

/** Combine the national digits with the country's calling code as one E.164 value. */
function toE164(country: CountryCode, national: string): string {
  const digits = national.replace(/\D/g, "");
  if (!digits) return "";
  return tryParse(digits, country)?.number ?? `+${getCountryCallingCode(country)}${digits}`;
}

function CountrySelect({country, onChange}: {country: CountryCode; onChange: (next: CountryCode | null) => void}) {
  return (
    <Select items={selectItems} value={country} onValueChange={onChange}>
      <SelectTrigger
        aria-label={m["sign_up.country_code_label"]()}
        className={cn(authInputClassName, "w-auto shrink-0 gap-1.5 px-3 text-sm")}
      >
        <SelectValue>{(iso: CountryCode) => flagEmoji(iso)}</SelectValue>
        <SelectIcon>
          <ChevronDown className="size-4" strokeWidth={1.5} aria-hidden="true" />
        </SelectIcon>
      </SelectTrigger>
      <SelectPortal>
        <SelectPositioner className="w-auto">
          <SelectPopup className="w-[280px]">
            {countryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} label={option.name}>
                <SelectItemText>
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true">{option.flag}</span>
                    {option.name}
                  </span>
                </SelectItemText>
                <span className="flex items-center gap-2">
                  <span className="text-grey-500">+{option.callingCode}</span>
                  <SelectItemIndicator />
                </span>
              </SelectItem>
            ))}
          </SelectPopup>
        </SelectPositioner>
      </SelectPortal>
    </Select>
  );
}

interface PhoneFieldProps {
  label: string;
  name: string;
  /** The combined value sent to the backend: E.164 like "+2348001234567", or "" when empty. */
  value: string;
  error?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

function NationalInput({
  control,
  name,
  placeholder,
  country,
  national,
  onChange,
}: {
  control: FormFieldControlProps;
  name: string;
  placeholder?: string;
  country: CountryCode;
  national: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="relative w-full">
      <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm leading-[1.4] tracking-[0.01em] text-primary-900">
        +{getCountryCallingCode(country)}
      </span>
      <Input
        {...control}
        type="tel"
        inputMode="tel"
        name={name}
        autoComplete="tel-national"
        placeholder={placeholder}
        value={national}
        onChange={(event) => onChange(event.target.value)}
        className={cn(authInputClassName, "pl-14 text-sm")}
      />
    </div>
  );
}

/**
 * Two-part phone field: a small country picker (flag) and a number input prefilled with the
 * country's calling code. `onChange` always receives the combined E.164 string (or "").
 */
export function PhoneField({label, name, value, error, placeholder, onChange}: PhoneFieldProps) {
  const [country, setCountry] = useState<CountryCode>(() => tryParse(value)?.country ?? DEFAULT_COUNTRY);
  const [national, setNational] = useState(() => tryParse(value)?.nationalNumber ?? "");

  function changeCountry(next: CountryCode | null) {
    if (!next) return;
    setCountry(next);
    onChange(toE164(next, national));
  }

  function changeNational(next: string) {
    setNational(next);
    onChange(toE164(country, next));
  }

  return (
    <FormField label={label} error={error}>
      {(control) => (
        <div className="flex items-start gap-2">
          <CountrySelect country={country} onChange={changeCountry} />
          <NationalInput
            control={control}
            name={name}
            placeholder={placeholder}
            country={country}
            national={national}
            onChange={changeNational}
          />
        </div>
      )}
    </FormField>
  );
}
