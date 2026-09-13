import {statsContent} from "@/content/landing";

export function TrustStats() {
  return (
    <section aria-labelledby="trust-stats-heading" className="bg-grey-100">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-9 px-6 py-16 md:px-10 lg:px-30 lg:py-25">
        <div className="flex flex-col gap-3.5">
          <h2
            id="trust-stats-heading"
            className="text-[32px] font-bold leading-[1.1] tracking-[-0.01em] text-black sm:text-[38px] lg:text-[42px]"
          >
            {statsContent.heading}
          </h2>
          <p className="max-w-[560px] text-base leading-[1.4] tracking-[0.01em] text-grey-600 sm:text-lg">{statsContent.subhead}</p>
        </div>

        <ul className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {statsContent.stats.map((stat) => (
            <li
              key={stat.id}
              className="relative flex aspect-square flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-b from-primary-600 via-primary-700 to-primary-800 p-6"
            >
              <img alt="" aria-hidden="true" className="size-12" src={stat.icon} />
              <div className="flex flex-col gap-1">
                <p className="text-[32px] font-bold leading-[1.1] tracking-[-0.01em] text-white">{stat.value}</p>
                <p className="text-base tracking-[0.01em] text-grey-100">{stat.label}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
