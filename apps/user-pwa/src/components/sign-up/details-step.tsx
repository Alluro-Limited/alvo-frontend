import {AuthField} from "@/components/auth/auth-field";
import {PhoneField} from "@/components/auth/phone-field";
import type {SignUpDetails} from "@/types/auth-types";
import {m} from "@/paraglide/messages";

interface DetailsStepProps {
  details: SignUpDetails;
  onChange: (patch: Partial<SignUpDetails>) => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isDetailsValid(details: SignUpDetails): boolean {
  return (
    details.fullName.trim().length > 0 &&
    details.preferredName.trim().length > 0 &&
    details.phone.length >= 10 &&
    EMAIL_RE.test(details.email)
  );
}

/** Step 1 — the five account fields. */
export function DetailsStep({details, onChange}: DetailsStepProps) {
  return (
    <div className="flex w-full flex-col gap-6">
      <AuthField
        id="su-full-name"
        label={m["su.full_name"]()}
        value={details.fullName}
        onChange={(fullName) => onChange({fullName})}
        placeholder={m["su.full_name_ph"]()}
        autoComplete="name"
      />
      <AuthField
        id="su-preferred-name"
        label={m["su.pref_name"]()}
        value={details.preferredName}
        onChange={(preferredName) => onChange({preferredName})}
        placeholder={m["su.pref_name_ph"]()}
        autoComplete="given-name"
      />
      <PhoneField id="su-phone" label={m["su.phone"]()} value={details.phone} onChange={(phone) => onChange({phone})} />
      <AuthField
        id="su-email"
        label={m["su.email"]()}
        type="email"
        value={details.email}
        onChange={(email) => onChange({email})}
        placeholder={m["su.email_ph"]()}
        autoComplete="email"
      />
      <AuthField
        id="su-referral"
        label={m["su.referral"]()}
        value={details.referralCode}
        onChange={(referralCode) => onChange({referralCode})}
        placeholder={m["su.referral_ph"]()}
      />
    </div>
  );
}
