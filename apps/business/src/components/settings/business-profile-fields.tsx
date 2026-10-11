import type {ChangeEvent} from "react";
import {Check} from "lucide-react";
import {FormField} from "@/components/auth/form-field";
import {SelectInput} from "@/components/auth/select-input";
import {AuthTextField} from "@/components/auth/text-field";
import {businessTypeOptions} from "@/components/sign-up/business-type-options";
import {m} from "@/paraglide/messages";
import {useLockersQuery} from "@/queries/use-shipment-queries";
import type {BusinessProfile, BusinessProfileUpdate} from "@/types/settings-types";

function CacField({cacNumber, verified}: {cacNumber: string | null; verified: boolean}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <span className="text-base leading-[1.4] tracking-[0.01em] text-primary-800">{m["settings.cac_number"]()}</span>
      <div className="flex items-center gap-6">
        <div className="flex flex-1 items-center rounded-lg border-[0.75px] border-grey-300 bg-grey-100 px-4 py-3.5">
          <span className="text-sm leading-[1.4] tracking-[0.14px] text-primary-900">{cacNumber ?? "—"}</span>
        </div>
        {verified && (
          <span className="flex items-center gap-1 rounded-lg bg-status-success-subtle p-1 text-xs leading-[1.4] font-medium tracking-[0.24px] text-status-success">
            <Check className="size-3" aria-hidden="true" />
            {m["settings.verified"]()}
          </span>
        )}
      </div>
    </div>
  );
}

interface BusinessProfileFieldsProps {
  profile: BusinessProfile;
  values: BusinessProfileUpdate;
  onChange: (values: BusinessProfileUpdate) => void;
}

/** Registered business details — name and CAC are read-only, type and origin locker are editable. */
export function BusinessProfileFields({profile, values, onChange}: BusinessProfileFieldsProps) {
  const {data: lockers = []} = useLockersQuery();
  return (
    <div className="flex flex-col gap-6">
      <AuthTextField label={m["settings.business_name"]()} value={profile.businessName} disabled className="bg-grey-100" />
      <FormField label={m["settings.business_type"]()}>
        {(control) => (
          <SelectInput
            {...control}
            value={values.businessType}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange({...values, businessType: e.target.value})}
            className="text-sm"
          >
            {businessTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label()}
              </option>
            ))}
          </SelectInput>
        )}
      </FormField>
      <CacField cacNumber={profile.cacNumber} verified={profile.cacVerified} />
      <FormField label={m["settings.origin_locker"]()}>
        {(control) => (
          <SelectInput
            {...control}
            value={values.originLockerId ?? ""}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange({...values, originLockerId: e.target.value})}
            className="text-sm"
          >
            {lockers.map((locker) => (
              <option key={locker.id} value={locker.id}>
                {locker.name}
              </option>
            ))}
          </SelectInput>
        )}
      </FormField>
    </div>
  );
}
