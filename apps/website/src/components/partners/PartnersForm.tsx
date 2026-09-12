import {type ReactNode} from "react";
import {ChevronDown} from "lucide-react";

import {partnersFormContent} from "@/content/partners";

function Field({children, label}: {children: ReactNode; label: string}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label className="text-base font-normal leading-[1.4] tracking-[0.01em] text-primary-800">{label}</label>
      {children}
    </div>
  );
}

function PartnerTypeSelect() {
  return (
    <div className="relative w-full">
      <select
        className="w-full appearance-none rounded-lg border border-grey-300 bg-white px-4 py-3.5 text-sm leading-[1.4] text-black"
        defaultValue=""
      >
        <option disabled value="">
          {partnersFormContent.fields.partnerType.placeholder}
        </option>
        {partnersFormContent.fields.partnerType.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-grey-500" aria-hidden="true" />
    </div>
  );
}

function FormFields() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <Field label={partnersFormContent.fields.organisation.label}>
          <input
            type="text"
            className="w-full rounded-lg border border-grey-300 px-4 py-3.5 text-sm leading-[1.4] text-black placeholder:text-grey-500"
            placeholder={partnersFormContent.fields.organisation.placeholder}
          />
        </Field>
        <Field label={partnersFormContent.fields.partnerType.label}>
          <PartnerTypeSelect />
        </Field>
      </div>

      <Field label={partnersFormContent.fields.location.label}>
        <input
          type="text"
          className="w-full rounded-lg border border-grey-300 px-4 py-3.5 text-sm leading-[1.4] text-black placeholder:text-grey-500"
          placeholder={partnersFormContent.fields.location.placeholder}
        />
      </Field>

      <Field label={partnersFormContent.fields.notes.label}>
        <textarea
          rows={4}
          className="w-full resize-none rounded-lg border border-grey-300 px-4 py-3.5 text-sm leading-[1.4] text-black placeholder:text-grey-500"
          placeholder={partnersFormContent.fields.notes.placeholder}
        />
      </Field>
    </div>
  );
}

export function PartnersForm() {
  return (
    <section className="bg-primary-500">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center px-6 py-24 md:px-10 lg:px-30">
        <form
          onSubmit={(event) => event.preventDefault()}
          className="w-full max-w-[590px] rounded-3xl border border-grey-200 bg-white p-8 sm:p-10"
        >
          <h2 className="mb-6 text-[28px] font-medium leading-[1.2] tracking-[-0.01em] text-black">{partnersFormContent.heading}</h2>

          <FormFields />

          <button
            type="submit"
            className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-lg bg-primary-500 px-5 text-base font-medium tracking-[0.02em] whitespace-nowrap text-cream transition-opacity hover:opacity-90"
          >
            {partnersFormContent.submit}
          </button>
        </form>
      </div>
    </section>
  );
}
