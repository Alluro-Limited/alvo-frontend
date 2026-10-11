import {Mail, MessageCircleMore, Phone} from "lucide-react";
import {m} from "@/paraglide/messages";
import {ContactCard, CopyAction} from "./contact-card";

/** The "Still need help?" row: live chat, email, and phone cards side by side. */
export function ContactSection() {
  return (
    <section id="still-need-help" className="flex scroll-mt-6 flex-col gap-4">
      <h2 className="text-base leading-[1.4] font-medium tracking-[0.16px] text-black">{m["help.contact_title"]()}</h2>
      <div className="flex gap-4">
        <ContactCard
          Icon={MessageCircleMore}
          iconClassName="bg-accent-50 text-accent-500"
          title={m["help.chat_title"]()}
          subtitle={m["help.chat_sub"]()}
          note={m["help.chat_note"]()}
        >
          <button
            type="button"
            className="flex h-[38px] w-full items-center justify-center rounded-lg bg-primary-500 px-3 py-2 text-base leading-[1.4] font-medium tracking-[0.32px] text-white hover:bg-primary-600"
          >
            {m["help.chat_cta"]()}
          </button>
        </ContactCard>
        <ContactCard
          Icon={Mail}
          iconClassName="bg-warning-50 text-warning-500"
          title={m["help.email_title"]()}
          subtitle={m["help.email_sub"]()}
          note={m["help.email_note"]()}
        >
          <CopyAction value="support@alvo.com" label={m["help.copy_email"]()} />
        </ContactCard>
        <ContactCard
          Icon={Phone}
          iconClassName="bg-secondary-50 text-secondary-500"
          title={m["help.call_title"]()}
          subtitle={m["help.call_sub"]()}
          note={m["help.call_note"]()}
        >
          <CopyAction value="0800 123 4567" label={m["help.copy_phone"]()} />
        </ContactCard>
      </div>
    </section>
  );
}
