import {Eyebrow} from "./Eyebrow";

import {featureRows} from "@/content/landing";

type FeatureRowData = (typeof featureRows)[number];

export function FeatureRow({row}: {row: FeatureRowData}) {
  return (
    <div
      id={row.id}
      className={`flex scroll-mt-24 flex-col items-center gap-8 lg:gap-8 ${row.reverse ? "lg:flex-row-reverse" : "lg:flex-row"}`}
    >
      <div className="flex w-full flex-col justify-between gap-10 lg:flex-1 lg:py-10">
        <div className="flex flex-col gap-8 lg:gap-14">
          <div className="flex flex-col gap-3">
            <Eyebrow label={row.eyebrow} />
            <h3 className="max-w-[420px] text-[28px] font-semibold leading-[1.1] tracking-[-0.01em] text-black sm:text-[32px]">
              {row.heading}
            </h3>
          </div>

          <div className="flex flex-col gap-6">
            {row.points.map((point) => (
              <div key={point.title} className="flex flex-col gap-4 border-t border-dashed border-black/15 pt-6">
                <h4 className="text-xl font-medium leading-[1.2] text-black">{point.title}</h4>
                <p className="max-w-[486px] text-base leading-[1.4] tracking-[0.01em] text-grey-600">{point.description}</p>
              </div>
            ))}
          </div>
        </div>

        <a
          href={row.learnMoreHref}
          className="text-base font-medium text-primary-500 underline decoration-1 underline-offset-4 transition-colors hover:text-primary-600"
        >
          Learn more
        </a>
      </div>

      <img
        src={row.media.src}
        alt={row.media.alt}
        className="aspect-square w-full shrink-0 rounded-3xl object-cover sm:max-w-[440px] lg:w-[48%] lg:max-w-[588px]"
      />
    </div>
  );
}
