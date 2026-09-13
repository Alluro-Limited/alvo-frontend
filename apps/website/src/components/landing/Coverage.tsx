import {Eyebrow} from "./Eyebrow";

import {coverageContent} from "@/content/landing";

export function Coverage() {
  return (
    <section id="coverage" aria-labelledby="coverage-heading" className="bg-grey-100">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-10 px-6 py-16 md:px-10 lg:flex-row lg:justify-between lg:gap-16 lg:px-30 lg:py-25">
        <div className="flex w-full max-w-[486px] flex-col gap-4">
          <div className="flex flex-col gap-3">
            <Eyebrow label={coverageContent.eyebrow} />
            <h2
              id="coverage-heading"
              className="text-[32px] font-bold leading-[1.1] tracking-[-0.01em] text-black sm:text-[38px] lg:text-[42px]"
            >
              {coverageContent.heading.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="text-base leading-[1.4] tracking-[0.01em] text-grey-600 sm:text-lg">{coverageContent.subhead}</p>
          </div>

          <div className="flex flex-wrap gap-[18px]">
            {coverageContent.pills.map((pill) => (
              <span key={pill} className="rounded-full bg-white px-[11px] py-[5px] text-xs font-medium tracking-[0.01em] text-primary-500">
                {pill}
              </span>
            ))}
          </div>
        </div>

        <img
          src={coverageContent.map.src}
          alt={coverageContent.map.alt}
          width={571}
          height={482}
          className="w-full max-w-[571px] rounded-3xl"
        />
      </div>
    </section>
  );
}
