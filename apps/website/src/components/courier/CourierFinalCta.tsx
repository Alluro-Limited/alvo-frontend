import {CourierAppButton} from "./CourierAppButton";

import {courierCtaContent} from "@/content/courier";

export function CourierFinalCta() {
  return (
    <section aria-labelledby="courier-cta-heading" className="bg-white">
      <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 lg:px-30 lg:py-20">
        <div className="relative mx-auto flex min-h-[440px] max-w-[1080px] flex-col justify-end overflow-hidden rounded-3xl p-4 sm:min-h-[540px] lg:h-[669px]">
          <img
            src={courierCtaContent.image.src}
            alt={courierCtaContent.image.alt}
            className="pointer-events-none absolute inset-0 size-full object-cover object-center"
          />

          <div className="relative flex flex-col items-center gap-6 rounded-2xl bg-cream p-8 text-center sm:p-10">
            <div className="flex max-w-[446px] flex-col gap-3">
              <h2
                id="courier-cta-heading"
                className="text-[28px] font-bold leading-[1.1] tracking-[-0.01em] text-black sm:text-[36px] lg:text-[42px]"
              >
                {courierCtaContent.heading}
              </h2>
              <p className="text-base leading-[1.4] tracking-[0.01em] text-black sm:text-lg">{courierCtaContent.subhead}</p>
            </div>

            <CourierAppButton label={courierCtaContent.cta} href={courierCtaContent.ctaHref} />
          </div>
        </div>
      </div>
    </section>
  );
}
