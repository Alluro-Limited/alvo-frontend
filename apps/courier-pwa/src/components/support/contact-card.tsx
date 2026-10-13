import {Mail, Phone} from "lucide-react";
import {m} from "@/paraglide/messages";
import type {SupportContact} from "@/types/earnings-types";

interface ContactCardProps {
  contact: SupportContact;
}

/** The grey Courier Support card: availability pill + phone/email rows with action tiles. */
export function ContactCard({contact}: ContactCardProps) {
  return (
    <section className="rounded-[16px] bg-grey-300 p-1 pt-2">
      <div className="flex items-center justify-between px-3 pb-2">
        <h2 className="text-[16px] font-bold">{contact.team}</h2>
        <span className="rounded-full bg-grey-400 px-2 py-1 text-[12px] font-medium text-primary-850">{contact.availability}</span>
      </div>
      <div className="rounded-[12px] bg-white px-4 py-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[14px] text-grey-500">{m["support.phone"]()}</p>
            <p className="mt-0.5 text-[16px] font-medium">{contact.phone}</p>
          </div>
          <a
            href={`tel:${contact.phone}`}
            aria-label={m["support.call"]()}
            className="grid size-10 place-items-center rounded-[8px] bg-[#f9f9f9]"
          >
            <Phone className="size-5" aria-hidden="true" />
          </a>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-[14px] text-grey-500">{m["support.email"]()}</p>
            <p className="mt-0.5 text-[16px] font-medium">{contact.email}</p>
          </div>
          <a
            href={`mailto:${contact.email}`}
            aria-label={m["support.write"]()}
            className="grid size-10 place-items-center rounded-[8px] bg-[#f9f9f9]"
          >
            <Mail className="size-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
