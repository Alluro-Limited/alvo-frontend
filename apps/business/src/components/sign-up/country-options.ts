import {getCountries, getCountryCallingCode, type CountryCode} from "libphonenumber-js";

export interface CountryOption {
  /** ISO 3166-1 alpha-2 code — the Select value. */
  value: CountryCode;
  name: string;
  flag: string;
  /** Calling code without the plus, e.g. "234". */
  callingCode: string;
}

/** Regional-indicator flag emoji for an ISO alpha-2 country code ("NG" → "🇳🇬"). */
export function flagEmoji(iso: string): string {
  const upper = iso.toUpperCase();
  return String.fromCodePoint(0x1f1e6 + upper.charCodeAt(0) - 65, 0x1f1e6 + upper.charCodeAt(1) - 65);
}

const regionNames = new Intl.DisplayNames(["en"], {type: "region"});

/** Every country libphonenumber supports, sorted by display name. */
export const countryOptions: CountryOption[] = getCountries()
  .map((iso) => ({
    value: iso,
    name: regionNames.of(iso) ?? iso,
    flag: flagEmoji(iso),
    callingCode: getCountryCallingCode(iso),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const DEFAULT_COUNTRY: CountryCode = "NG";
