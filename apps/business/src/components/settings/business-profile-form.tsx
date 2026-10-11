import {useState, type FormEvent} from "react";
import {AuthAlert} from "@/components/auth/auth-alert";
import {m} from "@/paraglide/messages";
import {useUpdateBusinessProfileMutation} from "@/queries/use-settings-queries";
import type {BusinessProfile, BusinessProfileUpdate} from "@/types/settings-types";
import {BusinessProfileFields} from "./business-profile-fields";
import {CardActions} from "./card-actions";
import {SettingsCard} from "./settings-card";

interface BusinessProfileFormProps {
  initial: BusinessProfile;
  /** The design's left footer action goes back to the user profile tab. */
  onBack: () => void;
}

/** "Business profile" tab — editable type/origin locker beside the read-only registered details. */
export function BusinessProfileForm({initial, onBack}: BusinessProfileFormProps) {
  const [values, setValues] = useState<BusinessProfileUpdate>({businessType: initial.businessType, originLockerId: initial.originLockerId});
  const [failed, setFailed] = useState(false);
  const mutation = useUpdateBusinessProfileMutation();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setFailed(false);
    mutation.mutate(values, {onError: () => setFailed(true)});
  };

  return (
    <form onSubmit={submit}>
      <SettingsCard
        title={m["settings.business_title"]()}
        subtitle={m["settings.business_sub"]()}
        footer={
          <CardActions
            cancelLabel={m["settings.back"]()}
            saveLabel={m["settings.save_changes"]()}
            onCancel={onBack}
            isSaving={mutation.isPending}
          />
        }
      >
        {failed && <AuthAlert tone="error">{m["settings.errors.save_failed"]()}</AuthAlert>}
        <BusinessProfileFields profile={initial} values={values} onChange={setValues} />
      </SettingsCard>
    </form>
  );
}
