import {Eyebrow} from "@/components/landing/Eyebrow";

import {courierBenefitsContent} from "@/content/courier";

export function CourierBenefits() {
  return (
    <section aria-labelledby="courier-benefits-heading" className="bg-white">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-10 px-6 py-16 md:px-10 lg:px-30 lg:py-25">
        <div className="flex max-w-[520px] flex-col items-center gap-3.5 text-center">
          <Eyebrow label={courierBenefitsContent.eyebrow} />
          <h2
            className="text-[32px] font-bold leading-[1.1] tracking-[-0.01em] text-black sm:text-[38px] lg:text-[42px]"
            id="courier-benefits-heading"
          >
            {courierBenefitsContent.heading}
          </h2>
        </div>

        <ul className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {courierBenefitsContent.cards.map((card) => (
            <li key={card.id} className="flex flex-col rounded-lg border border-grey-200 bg-white px-6 py-7">
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-grey-100">
                <img alt="" aria-hidden="true" className="size-6" src={card.icon} />
              </span>
              <h3 className="mt-4 text-base font-bold tracking-[-0.015em] text-black">{card.title}</h3>
              <p className="mt-1 text-sm leading-5 tracking-[-0.005em] text-grey-600">{card.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
