import {SmeHeroCtas} from "./SmeHeroCtas";
import {Navbar} from "@/components/landing/Navbar";

import {smeHeroContent} from "@/content/sme";

export function SmeHero() {
  return (
    <section
      aria-label="Business hero"
      className="relative isolate flex min-h-[600px] flex-col overflow-clip sm:min-h-[720px] lg:h-[800px]"
    >
      <img alt="" aria-hidden="true" className="absolute inset-0 -z-20 size-full object-cover" src={smeHeroContent.image.src} />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/40" />

      <Navbar />

      <div className="mx-auto flex w-full max-w-[640px] flex-1 flex-col items-center justify-center gap-8 px-6 pt-28 pb-16 text-center">
        <div className="flex flex-col gap-4">
          <h1 className="text-[36px] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[48px] lg:text-[60px]">
            {smeHeroContent.headline}
          </h1>
          <p className="text-base font-medium leading-[1.4] tracking-[0.01em] text-white/90">{smeHeroContent.subhead}</p>
        </div>

        <SmeHeroCtas />
      </div>
    </section>
  );
}
