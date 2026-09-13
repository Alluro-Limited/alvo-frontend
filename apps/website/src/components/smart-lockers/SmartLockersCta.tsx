import {Cta} from "@/components/Cta";
import {smartLockersCtaContent} from "@/content/smart-lockers";

export function SmartLockersCta() {
  return (
    <Cta
      id="smart-lockers-cta"
      heading={smartLockersCtaContent.heading}
      subhead={smartLockersCtaContent.subhead}
      background={
        <img
          alt={smartLockersCtaContent.client.alt}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full object-cover"
          src={smartLockersCtaContent.client.src}
        />
      }
      className="min-h-[440px] sm:min-h-[540px] lg:h-[669px]"
    >
      <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
        <a
          href={smartLockersCtaContent.primaryHref}
          className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-primary-500 px-5 text-base font-medium tracking-[0.02em] whitespace-nowrap text-cream transition-opacity hover:opacity-90 sm:w-auto"
        >
          {smartLockersCtaContent.primaryCta}
        </a>

        <a
          href={smartLockersCtaContent.secondaryHref}
          className="inline-flex h-12 w-full items-center justify-center rounded-lg border border-primary-500 bg-transparent px-5 text-base font-medium tracking-[0.02em] whitespace-nowrap text-primary-500 transition-colors hover:bg-primary-500/5 sm:w-auto"
        >
          {smartLockersCtaContent.secondaryCta}
        </a>
      </div>
    </Cta>
  );
}
