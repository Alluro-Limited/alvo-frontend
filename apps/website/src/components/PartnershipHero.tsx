import {Navbar} from "./landing/Navbar";

export type PartnershipHeroContent = {
  headline: string;
  subhead: string;
  primaryCta: string;
  primaryHref: string;
  secondaryCta: string;
  secondaryHref: string;
};

const slots = [false, true, false, false, true, false, false, false, false, false, true, false];

function LockerSlot({selected}: {selected: boolean}) {
  return (
    <div
      className={`relative h-28 rounded-lg ${
        selected ? "bg-primary-600 shadow-lg shadow-primary-600/40" : "bg-white/5 ring-1 ring-inset ring-white/10"
      }`}
    >
      <div className={`absolute top-1/2 right-2 h-4 w-1 -translate-y-1/2 rounded-full ${selected ? "bg-white/70" : "bg-white/30"}`} />
    </div>
  );
}

export function PartnershipHero({content}: {content: PartnershipHeroContent}) {
  return (
    <section className="relative bg-white">
      <Navbar />

      <div className="mx-auto flex min-h-[700px] max-w-[1440px] flex-col items-center justify-center gap-12 px-6 pt-40 pb-20 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-30">
        <div className="flex w-full max-w-xl flex-col items-start gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="text-[36px] font-bold leading-[1.1] tracking-[-0.01em] text-black sm:text-[48px] lg:text-[60px]">
              {content.headline}
            </h1>
            <p className="text-base font-medium leading-[1.4] tracking-[0.01em] text-grey-600">{content.subhead}</p>
          </div>

          <div className="flex w-full flex-col items-start gap-3 sm:w-auto sm:flex-row">
            <a
              href={content.primaryHref}
              className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-primary-500 px-5 text-base font-medium tracking-[0.02em] whitespace-nowrap text-cream transition-opacity hover:opacity-90 sm:w-auto"
            >
              {content.primaryCta}
            </a>
            <a
              href={content.secondaryHref}
              className="inline-flex h-12 w-full items-center justify-center rounded-lg border border-primary-500 px-5 text-base font-medium tracking-[0.02em] whitespace-nowrap text-primary-500 transition-colors hover:bg-primary-500/5 sm:w-auto"
            >
              {content.secondaryCta}
            </a>
          </div>
        </div>

        <div className="w-full max-w-[420px] shrink-0 rounded-3xl bg-primary-500 p-7 shadow-xl">
          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-inset ring-white/10">
            <div className="grid grid-cols-4 gap-1.5">
              {slots.map((selected, index) => (
                <LockerSlot key={index} selected={selected} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
