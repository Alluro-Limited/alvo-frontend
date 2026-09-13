import {Headset} from "lucide-react";

import {contactHeroContent} from "@/content/contact";

export function ContactHero() {
  return (
    <section
      aria-label="Contact hero"
      className="relative flex min-h-[400px] items-center justify-center bg-white px-6 py-32 sm:px-10 lg:px-30"
    >
      <div className="flex max-w-[960px] flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-[539px] flex-col gap-4">
          <h1 className="font-sans text-[40px] font-bold leading-[1.1] tracking-[-0.6px] text-black sm:text-[48px] lg:text-[60px]">
            {contactHeroContent.heading}
          </h1>
          <p className="font-sans text-base font-medium leading-[1.4] tracking-[0.16px] text-grey-600">{contactHeroContent.subhead}</p>
        </div>

        <Headset className="size-32 shrink-0 text-primary-500 sm:size-40 lg:size-[180px]" strokeWidth={1.5} />
      </div>
    </section>
  );
}
