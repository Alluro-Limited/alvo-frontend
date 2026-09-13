import {aboutMissionContent} from "@/content/about";

export function AboutMission() {
  return (
    <section className="bg-white px-6 py-24 sm:px-10 lg:px-30">
      <div className="mx-auto flex max-w-360 flex-col items-start gap-12 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-[612px] flex-col gap-6">
          {aboutMissionContent.paragraphs.map((paragraph) => (
            <p key={paragraph} className="font-sans text-xl font-medium leading-[1.2] tracking-[-0.24px] text-primary-700 lg:text-2xl">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="relative h-[406px] w-full shrink-0 overflow-hidden rounded-xl lg:w-[486px]">
          <img
            alt={aboutMissionContent.image.alt}
            className="absolute inset-0 -left-1/4 size-full object-cover"
            src={aboutMissionContent.image.src}
          />
        </div>
      </div>
    </section>
  );
}
