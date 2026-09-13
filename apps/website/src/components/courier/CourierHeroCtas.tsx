import {courierHeroContent} from "@/content/courier";

export function CourierHeroCtas() {
  return (
    <div className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
      <a
        href={courierHeroContent.primaryHref}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-white px-5 text-base font-medium tracking-[0.02em] whitespace-nowrap text-primary-500 sm:w-auto"
      >
        <span className="inline-flex items-center gap-1">
          <img alt="" aria-hidden="true" className="size-5" src="/landing/hero/google-play.svg" />
          <span className="h-5 w-px bg-grey-200" />
          <img alt="" aria-hidden="true" className="size-5" src="/landing/hero/appstore.svg" />
        </span>
        {courierHeroContent.primaryCta}
      </a>

      <a
        href={courierHeroContent.secondaryHref}
        className="inline-flex h-12 w-full items-center justify-center rounded-lg border border-white/80 px-5 text-base font-medium tracking-[0.02em] whitespace-nowrap text-white transition-colors hover:bg-white/10 sm:w-auto"
      >
        {courierHeroContent.secondaryCta}
      </a>
    </div>
  );
}
