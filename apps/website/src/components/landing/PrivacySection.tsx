import {PrivacyReasons} from "./PrivacyReasons";

import {privacyContent} from "@/content/landing";

export function PrivacySection() {
  return (
    <section id="why-alvo" aria-labelledby="why-alvo-heading">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-12 px-6 py-16 md:px-10 lg:gap-14 lg:py-25">
        <div className="flex max-w-[624px] flex-col items-center gap-3.5 text-center">
          <span className="inline-flex items-center gap-2">
            <span className="size-[7px] rounded-full bg-primary-500 ring-4 ring-primary-500/15" />
            <span className="text-xs font-medium tracking-[0.06em] text-primary-500">{privacyContent.eyebrow}</span>
          </span>

          <h2
            id="why-alvo-heading"
            className="text-[32px] font-bold leading-[1.1] tracking-[-0.01em] text-background sm:text-[38px] lg:text-[42px]"
          >
            {privacyContent.heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>

          <p className="text-base font-medium leading-[1.4] tracking-[0.01em] text-grey-600 sm:text-lg">{privacyContent.subhead}</p>
        </div>

        <PrivacyReasons />
      </div>
    </section>
  );
}
