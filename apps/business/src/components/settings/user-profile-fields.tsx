import type {ChangeEvent} from "react";
import {AuthTextField} from "@/components/auth/text-field";
import {m} from "@/paraglide/messages";
import type {UserProfile} from "@/types/settings-types";

interface UserProfileFieldsProps {
  values: UserProfile;
  errors: Partial<Record<keyof UserProfile, string>>;
  onChange: (key: keyof UserProfile, value: string) => void;
}

/** The four personal-detail inputs inside the user profile card. */
export function UserProfileFields({values, errors, onChange}: UserProfileFieldsProps) {
  const handler = (key: keyof UserProfile) => (event: ChangeEvent<HTMLInputElement>) => onChange(key, event.target.value);
  return (
    <div className="flex flex-col gap-6">
      <AuthTextField label={m["settings.first_name"]()} value={values.firstName} onChange={handler("firstName")} error={errors.firstName} />
      <AuthTextField label={m["settings.last_name"]()} value={values.lastName} onChange={handler("lastName")} error={errors.lastName} />
      <AuthTextField label={m["settings.phone"]()} type="tel" value={values.phone} onChange={handler("phone")} error={errors.phone} />
      <AuthTextField label={m["settings.email"]()} type="email" value={values.email} onChange={handler("email")} error={errors.email} />
    </div>
  );
}
