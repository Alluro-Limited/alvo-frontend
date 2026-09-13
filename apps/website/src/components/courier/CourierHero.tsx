import {Navbar} from "@/components/landing/Navbar";
import {CourierHeroCtas} from "./CourierHeroCtas";

import {courierHeroContent} from "@/content/courier";

export function CourierHero() {
  return (
    <section
      aria-label="Courier hero"
      className="relative isolate flex min-h-[600px] flex-col overflow-clip bg-teal-700 sm:min-h-[720px] lg:h-[900px]"
    >
      <img
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 w-full object-cover"
        src="/courier/hero-clouds.png"
      />
      <img
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 w-full object-cover object-bottom"
        src="/courier/hero-cityscape.png"
      />

      {/* Road strip with centre-line dashes */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-14 bg-teal-800 sm:h-16" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-6 -z-10 h-[3px] bg-[repeating-linear-gradient(to_right,rgba(255,255,255,0.9)_0_32px,transparent_32px_60px)] sm:bottom-7"
      />

      <Navbar />

      <div className="mx-auto flex w-full max-w-360 flex-1 flex-col items-center justify-center px-6 pt-28 pb-24 text-center md:px-10 lg:pt-32">
        <h1 className="max-w-[720px] text-[36px] font-bold leading-[1.1] tracking-[-0.01em] text-white sm:text-[48px] lg:text-[60px]">
          {courierHeroContent.headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        <p className="mt-4 max-w-[620px] text-base font-medium leading-[1.4] tracking-[0.01em] text-white/90 sm:mt-5">
          {courierHeroContent.subhead}
        </p>

        <CourierHeroCtas />
      </div>
    </section>
  );
}
