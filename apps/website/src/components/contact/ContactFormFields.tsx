import {ChevronDown} from "lucide-react";

import {contactFormContent} from "@/content/contact";

type FormState = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

function Field({label, value, onChange, placeholder}: FieldProps) {
  return (
    <label className="flex w-full flex-col gap-2">
      <span className="font-sans text-base font-normal tracking-[0.16px] text-primary-800">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-[50px] w-full rounded-lg border border-grey-300 bg-white px-4 font-sans text-sm font-normal tracking-[0.14px] text-black placeholder:text-grey-500 focus:border-primary-500 focus:outline-none"
      />
    </label>
  );
}

function TextareaField({label, value, onChange, placeholder}: FieldProps) {
  return (
    <label className="flex w-full flex-col gap-2">
      <span className="font-sans text-base font-normal tracking-[0.16px] text-primary-800">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={5}
        className="w-full resize-none rounded-lg border border-grey-300 bg-white px-4 py-3.5 font-sans text-sm font-normal tracking-[0.14px] text-black placeholder:text-grey-500 focus:border-primary-500 focus:outline-none"
      />
    </label>
  );
}

type SelectFieldProps = FieldProps & {options: readonly string[]};

function SelectField({label, value, onChange, placeholder, options}: SelectFieldProps) {
  return (
    <label className="relative flex w-full flex-col gap-2">
      <span className="font-sans text-base font-normal tracking-[0.16px] text-primary-800">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-[50px] w-full appearance-none rounded-lg border border-grey-300 bg-white px-4 font-sans text-sm font-normal tracking-[0.14px] text-black focus:border-primary-500 focus:outline-none"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-grey-500" />
      </div>
    </label>
  );
}

type ContactFormFieldsProps = {
  form: FormState;
  onChange: (form: FormState) => void;
};

export function ContactFormFields({form, onChange}: ContactFormFieldsProps) {
  const {fields, topics} = contactFormContent;
  const update = (key: keyof FormState) => (value: string) => onChange({...form, [key]: value});

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={fields.name.label} value={form.name} onChange={update("name")} placeholder={fields.name.placeholder} />
        <Field label={fields.email.label} value={form.email} onChange={update("email")} placeholder={fields.email.placeholder} />
      </div>
      <SelectField
        label={fields.topic.label}
        value={form.topic}
        onChange={update("topic")}
        placeholder={fields.topic.placeholder}
        options={topics}
      />
      <TextareaField
        label={fields.message.label}
        value={form.message}
        onChange={update("message")}
        placeholder={fields.message.placeholder}
      />
    </div>
  );
}
