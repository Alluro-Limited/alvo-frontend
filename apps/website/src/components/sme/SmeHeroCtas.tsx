import {smeHeroContent} from "@/content/sme";

export function SmeHeroCtas() {
  return (
    <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
      <a
        href={smeHeroContent.primaryHref}
        className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-white px-5 text-base font-medium tracking-[0.02em] whitespace-nowrap text-primary-500 transition-colors hover:bg-white/90 sm:w-auto"
      >
        {smeHeroContent.primaryCta}
      </a>

      <a
        href={smeHeroContent.secondaryHref}
        className="inline-flex h-12 w-full items-center justify-center rounded-lg border border-white/80 px-5 text-base font-medium tracking-[0.02em] whitespace-nowrap text-white transition-colors hover:bg-white/10 sm:w-auto"
      >
        {smeHeroContent.secondaryCta}
      </a>
    </div>
  );
}
