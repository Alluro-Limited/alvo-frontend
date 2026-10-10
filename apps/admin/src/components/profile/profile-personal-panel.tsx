import {useState} from "react";
import {Button} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import type {AdminProfile, ProfileOptions, UpdateProfileInput} from "@/types/profile-types";
import {ADMIN_INPUT, ADMIN_LABEL} from "@/components/admins/admin-info-fields";
import {SettingSelect} from "@/components/settings/settings-panel";

interface PersonalPanelProps {
  profile: AdminProfile;
  options: ProfileOptions | undefined;
  saving: boolean;
  failed: boolean;
  onSave: (input: UpdateProfileInput) => void;
}

function ValueRow({label, value}: {label: string; value: string}) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-grey-200 py-4 last:border-b-0">
      <p className="text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{label}</p>
      <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{value}</p>
    </div>
  );
}

/** Personal Information tab — read view flips into an editable form via Edit. */
export function ProfilePersonalPanel({profile, options, saving, failed, onSave}: PersonalPanelProps) {
  const [editing, setEditing] = useState(false);
  return (
    <section className="w-[651px] rounded-2xl border border-grey-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg leading-[1.4] font-semibold text-black">{m["profile.personal_title"]()}</h2>
          <p className="pt-1 text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{m["profile.personal_subtitle"]()}</p>
        </div>
        {!editing && (
          <Button variant="outline" onClick={() => setEditing(true)}>
            {m["profile.edit"]()}
          </Button>
        )}
      </div>
      {editing ? (
        <PersonalForm
          profile={profile}
          options={options}
          saving={saving}
          failed={failed}
          onCancel={() => setEditing(false)}
          onSave={onSave}
        />
      ) : (
        <div className="pt-3">
          <ValueRow label={m["profile.first_name"]()} value={profile.firstName} />
          <ValueRow label={m["profile.last_name"]()} value={profile.lastName} />
          <ValueRow label={m["profile.email"]()} value={profile.email} />
          <ValueRow label={m["profile.phone"]()} value={profile.phone} />
          <ValueRow label={m["profile.role"]()} value={profile.roleLabel} />
          <ValueRow label={m["profile.timezone"]()} value={profile.timezone} />
          <ValueRow label={m["profile.date_format"]()} value={profile.dateFormat} />
        </div>
      )}
    </section>
  );
}

interface PersonalFormProps extends Omit<PersonalPanelProps, "onSave"> {
  onCancel: () => void;
  onSave: (input: UpdateProfileInput) => void;
}

function PersonalForm({profile, options, saving, failed, onCancel, onSave}: PersonalFormProps) {
  const [form, setForm] = useState<UpdateProfileInput>({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phone,
    timezone: profile.timezone,
    dateFormat: profile.dateFormat,
  });
  const set = (key: keyof UpdateProfileInput) => (value: string) => setForm((prev) => ({...prev, [key]: value}));

  return (
    <form
      noValidate
      className="pt-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (!saving) onSave(form);
      }}
    >
      <PersonalFormGrid form={form} options={options} set={set} />
      {failed && <p className="pt-3 text-sm leading-[1.4] tracking-[0.14px] text-status-fail">{m["profile.save_error"]()}</p>}
      <div className="mt-5 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
          {m["profile.cancel"]()}
        </Button>
        <Button type="submit" isLoading={saving}>
          {saving ? m["profile.saving"]() : m["profile.save"]()}
        </Button>
      </div>
    </form>
  );
}

function PersonalFormGrid({
  form,
  options,
  set,
}: {
  form: UpdateProfileInput;
  options: ProfileOptions | undefined;
  set: (key: keyof UpdateProfileInput) => (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormInput id="pf-first" label={m["profile.first_name"]()} value={form.firstName} onChange={set("firstName")} />
      <FormInput id="pf-last" label={m["profile.last_name"]()} value={form.lastName} onChange={set("lastName")} />
      <FormInput id="pf-email" label={m["profile.email"]()} value={form.email} onChange={set("email")} />
      <FormInput id="pf-phone" label={m["profile.phone"]()} value={form.phone} onChange={set("phone")} />
      <FormSelect
        id="pf-tz"
        label={m["profile.timezone"]()}
        value={form.timezone}
        options={options?.timezones ?? [form.timezone]}
        onChange={set("timezone")}
      />
      <FormSelect
        id="pf-df"
        label={m["profile.date_format"]()}
        value={form.dateFormat}
        options={options?.dateFormats ?? [form.dateFormat]}
        onChange={set("dateFormat")}
      />
    </div>
  );
}

function FormSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className={ADMIN_LABEL} htmlFor={id}>
        {label}
      </label>
      <SettingSelect id={id} value={value} options={options} onChange={onChange} />
    </div>
  );
}

function FormInput({id, label, value, onChange}: {id: string; label: string; value: string; onChange: (v: string) => void}) {
  return (
    <div>
      <label className={ADMIN_LABEL} htmlFor={id}>
        {label}
      </label>
      <input id={id} value={value} onChange={(event) => onChange(event.target.value)} className={ADMIN_INPUT} />
    </div>
  );
}
