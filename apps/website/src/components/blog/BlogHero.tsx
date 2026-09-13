import {blogHeroContent} from "@/content/blog";

export function BlogHero() {
  const {heading, subhead, texture, icon} = blogHeroContent;

  return (
    <section className="relative overflow-hidden bg-primary-500 px-6 py-24 lg:py-60 sm:px-10 lg:px-30">
      <img
        alt={texture.alt}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full object-cover mix-blend-hard-light"
        src={texture.src}
      />
      <div className="relative mx-auto flex max-w-300 flex-col items-center gap-10 lg:flex-row lg:justify-between">
        <div className="flex max-w-141.75 flex-col gap-4 text-white">
          <h1 className="font-sans text-[40px] font-bold leading-[1.1] tracking-[-0.6px] sm:text-[50px] lg:text-[60px]">{heading}</h1>
          <p className="font-sans text-lg font-medium leading-[1.2] tracking-normal text-white/90">{subhead}</p>
        </div>
        <div className="shrink-0 rounded-full bg-white p-8 sm:p-12">
          <img alt={icon.alt} aria-hidden="true" className="size-32 sm:size-44" src={icon.src} />
        </div>
      </div>
    </section>
  );
}
