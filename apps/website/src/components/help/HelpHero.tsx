import {helpHeroContent} from "@/content/help";

export function HelpHero() {
  return (
    <section className="relative bg-white px-6 py-24 lg:py-60 sm:px-10 lg:px-30">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-12 lg:flex-row lg:justify-between lg:gap-16">
        <div className="flex w-full max-w-[608px] flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="font-sans text-[40px] font-bold leading-[1.1] tracking-[-0.4px] text-black sm:text-[48px] sm:tracking-[-0.48px] lg:text-[60px] lg:tracking-[-0.6px]">
              {helpHeroContent.heading}
            </h1>
            <p className="font-sans text-base font-medium leading-[1.4] tracking-[0.16px] text-grey-600">{helpHeroContent.subhead}</p>
          </div>
          <div className="w-full max-w-[485px]">
            <input
              aria-label="Search help topics"
              className="h-[50px] w-full rounded-lg border border-grey-300 bg-white px-4 py-3.5 font-sans text-sm font-normal text-grey-800 outline-none transition-colors placeholder:text-grey-500 focus:border-primary-500"
              placeholder={helpHeroContent.placeholder}
              type="text"
            />
          </div>
        </div>
        <div className="shrink-0 overflow-clip rounded-full bg-white shadow-none">
          <div className="flex size-[180px] items-center justify-center">
            <img alt="" className="size-[160px] object-contain" src={helpHeroContent.icon} />
          </div>
        </div>
      </div>
    </section>
  );
}
