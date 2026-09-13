import {Cta} from "@/components/Cta";

import {aboutCtaContent} from "@/content/about";

export function AboutCta() {
  return (
    <Cta
      id="about-cta"
      heading={aboutCtaContent.heading}
      subhead={aboutCtaContent.subhead}
      background={
        <img
          alt={aboutCtaContent.background.alt}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full object-cover"
          src={aboutCtaContent.background.src}
        />
      }
      className="min-h-[338px]"
    >
      <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
        <a
          href={aboutCtaContent.primaryHref}
          className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-primary-500 px-5 text-base font-medium tracking-[0.02em] whitespace-nowrap text-cream transition-opacity hover:opacity-90 sm:w-auto"
        >
          {aboutCtaContent.primaryCta}
        </a>

        <a
          href={aboutCtaContent.secondaryHref}
          className="inline-flex h-12 w-full items-center justify-center rounded-lg border border-primary-500 bg-transparent px-5 text-base font-medium tracking-[0.02em] whitespace-nowrap text-primary-500 transition-colors hover:bg-primary-500/5 sm:w-auto"
        >
          {aboutCtaContent.secondaryCta}
        </a>
      </div>
    </Cta>
  );
}
