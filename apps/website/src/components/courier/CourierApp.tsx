import {Eyebrow} from "@/components/landing/Eyebrow";

import {courierAppContent} from "@/content/courier";

export function CourierApp() {
  return (
    <section aria-labelledby="courier-app-heading" className="bg-white">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-10 px-6 py-16 md:px-10 lg:flex-row lg:gap-8 lg:px-30 lg:py-25">
        <div className="flex w-full flex-col gap-6 lg:flex-1">
          <div className="flex flex-col gap-3">
            <Eyebrow label={courierAppContent.eyebrow} />
            <div className="flex flex-col gap-2">
              <h2
                id="courier-app-heading"
                className="max-w-[405px] text-[28px] font-bold leading-[1.1] tracking-[-0.01em] text-black sm:text-[32px]"
              >
                {courierAppContent.heading}
              </h2>
              <p className="max-w-[427px] text-base leading-[1.4] tracking-[0.01em] text-grey-600">{courierAppContent.subhead}</p>
            </div>
          </div>

          <ul className="flex flex-col gap-3">
            {courierAppContent.features.map((feature) => (
              <li key={feature} className="flex items-start gap-[9px]">
                <img alt="" aria-hidden="true" className="mt-[2px] size-[15px] shrink-0" src="/courier/check.svg" />
                <span className="text-sm leading-[1.4] tracking-[0.01em] text-grey-600">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <img
          src={courierAppContent.media.src}
          alt={courierAppContent.media.alt}
          className="aspect-square w-full shrink-0 rounded-3xl object-cover sm:max-w-[440px] lg:w-[48%] lg:max-w-[588px]"
        />
      </div>
    </section>
  );
}
