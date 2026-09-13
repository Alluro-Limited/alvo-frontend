import {MapPin} from "lucide-react";

import {contactOfficeContent} from "@/content/contact";

export function ContactOffice() {
  return (
    <section className="bg-white px-6 py-24 sm:px-10 lg:px-30">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-3.5 text-center">
          <div className="flex items-center gap-2">
            <div className="size-[7px] rounded-[1.5px] bg-primary-500 shadow-[0_0_0_4px_#dceee8]" />
            <span className="font-sans text-xs font-medium tracking-[0.12px] text-primary-500">{contactOfficeContent.eyebrow}</span>
          </div>
          <h2 className="font-sans text-[28px] font-bold leading-[1.1] tracking-[-0.42px] text-black sm:text-[36px] lg:text-[42px]">
            {contactOfficeContent.heading}
          </h2>
        </div>

        <div className="relative h-[320px] w-full overflow-hidden rounded-3xl sm:h-[420px] lg:h-[520px]">
          <img alt={contactOfficeContent.map.alt} className="absolute inset-0 size-full object-cover" src={contactOfficeContent.map.src} />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="mb-1 inline-flex items-center justify-center rounded-xl bg-[rgba(15,15,20,0.88)] px-4 py-2 text-center">
              <span className="font-sans text-sm font-medium tracking-[0.14px] text-white">{contactOfficeContent.label}</span>
            </div>
            <div className="flex justify-center">
              <MapPin className="size-10 fill-primary-500 text-primary-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
