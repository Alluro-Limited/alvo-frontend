import {AuthAlert} from "@/components/auth/auth-alert";
import {m} from "@/paraglide/messages";
import {CardActions} from "./card-actions";
import {PasswordFields} from "./password-fields";
import {SettingsCard} from "./settings-card";
import {usePasswordForm} from "./use-password-form";

/** "Security" tab — change-password card. */
export function PasswordForm() {
  const {values, errors, banner, submit, reset, isSaving, setValues} = usePasswordForm();

  return (
    <form onSubmit={submit} noValidate>
      <SettingsCard
        title={m["settings.password_title"]()}
        subtitle={m["settings.password_sub"]()}
        footer={
          <CardActions
            cancelLabel={m["settings.cancel"]()}
            saveLabel={m["settings.save_password"]()}
            onCancel={reset}
            isSaving={isSaving}
          />
        }
      >
        {banner === "success" && <AuthAlert tone="success">{m["settings.password_saved"]()}</AuthAlert>}
        {banner === "wrong" && <AuthAlert tone="error">{m["settings.errors.wrong_password"]()}</AuthAlert>}
        {banner === "failed" && <AuthAlert tone="error">{m["settings.errors.save_failed"]()}</AuthAlert>}
        <PasswordFields values={values} errors={errors} onChange={(key, value) => setValues((prev) => ({...prev, [key]: value}))} />
      </SettingsCard>
    </form>
  );
}
