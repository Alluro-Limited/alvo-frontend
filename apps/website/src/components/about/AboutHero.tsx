import {aboutHeroContent} from "@/content/about";

export function AboutHero() {
  return (
    <section
      aria-label="About hero"
      className="relative flex min-h-[600px] items-center justify-center bg-grey-100 px-6 py-32 sm:px-10 lg:px-30"
    >
      <div className="flex max-w-[672px] flex-col items-center gap-4 text-center text-primary-500">
        <h1 className="font-sans text-[40px] font-bold leading-[1.1] tracking-[-0.6px] sm:text-[48px] lg:text-[60px]">
          {aboutHeroContent.heading}
        </h1>
        <p className="font-sans text-base font-medium leading-[1.4] tracking-[0.16px]">{aboutHeroContent.subhead}</p>
      </div>
    </section>
  );
}
