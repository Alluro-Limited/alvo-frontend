import {useState, type FormEvent} from "react";
import {AuthAlert} from "@/components/auth/auth-alert";
import {m} from "@/paraglide/messages";
import {useUpdateUserProfileMutation} from "@/queries/use-settings-queries";
import type {UserProfile} from "@/types/settings-types";
import {CardActions} from "./card-actions";
import {SettingsCard} from "./settings-card";
import {UserProfileFields} from "./user-profile-fields";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface UserProfileFormProps {
  initial: UserProfile;
}

type FieldErrors = Partial<Record<keyof UserProfile, string>>;

function validate(values: UserProfile): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.firstName.trim()) errors.firstName = m["settings.errors.required"]();
  if (!values.lastName.trim()) errors.lastName = m["settings.errors.required"]();
  if (!values.phone.trim()) errors.phone = m["settings.errors.required"]();
  if (!EMAIL_RE.test(values.email.trim())) errors.email = m["settings.errors.email"]();
  return errors;
}

/** "User profile" tab — personal contact details. */
export function UserProfileForm({initial}: UserProfileFormProps) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [failed, setFailed] = useState(false);
  const mutation = useUpdateUserProfileMutation();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const fieldErrors = validate(values);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;
    setFailed(false);
    mutation.mutate(values, {onError: () => setFailed(true)});
  };

  return (
    <form onSubmit={submit} noValidate>
      <SettingsCard
        title={m["settings.user_title"]()}
        subtitle={m["settings.user_sub"]()}
        footer={
          <CardActions
            cancelLabel={m["settings.cancel"]()}
            saveLabel={m["settings.save_changes"]()}
            onCancel={() => {
              setValues(initial);
              setErrors({});
              setFailed(false);
            }}
            isSaving={mutation.isPending}
          />
        }
      >
        {failed && <AuthAlert tone="error">{m["settings.errors.save_failed"]()}</AuthAlert>}
        <UserProfileFields values={values} errors={errors} onChange={(key, value) => setValues((prev) => ({...prev, [key]: value}))} />
      </SettingsCard>
    </form>
  );
}
