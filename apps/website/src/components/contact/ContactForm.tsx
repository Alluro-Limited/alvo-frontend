import {useState} from "react";

import {ContactFormFields} from "./ContactFormFields";

import {contactFormContent} from "@/content/contact";

export function ContactForm() {
  const {eyebrow, heading, submit} = contactFormContent;
  const [form, setForm] = useState({name: "", email: "", topic: "", message: ""});

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <section className="bg-primary-500 px-6 py-24 sm:px-10 lg:px-30">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-[590px] flex-col gap-8 rounded-3xl border border-grey-200 bg-white p-8 sm:p-10"
      >
        <div className="flex w-full flex-col items-center gap-3.5 text-center">
          <div className="flex items-center gap-2">
            <div className="size-[7px] rounded-[1.5px] bg-primary-500 shadow-[0_0_0_4px_#dceee8]" />
            <span className="font-sans text-xs font-medium tracking-[0.12px] text-primary-500">{eyebrow}</span>
          </div>
          <h2 className="font-sans text-[28px] font-medium leading-[1.2] tracking-[-0.28px] text-black">{heading}</h2>
        </div>

        <ContactFormFields form={form} onChange={setForm} />

        <button
          type="submit"
          className="inline-flex h-[50px] w-full items-center justify-center rounded-lg bg-primary-500 px-5 font-sans text-base font-medium tracking-[0.02em] text-white transition-opacity hover:opacity-90"
        >
          {submit}
        </button>
      </form>
    </section>
  );
}
