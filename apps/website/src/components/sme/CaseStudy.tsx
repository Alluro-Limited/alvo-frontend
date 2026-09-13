import {Eyebrow} from "@/components/landing/Eyebrow";
import {smeCaseStudyContent} from "@/content/sme";

export function CaseStudy() {
  const {eyebrow, heading, body, stats} = smeCaseStudyContent;
  return (
    <section aria-labelledby="sme-case-study-heading" className="bg-white">
      <div className="mx-auto flex max-w-[1202px] flex-col gap-10 px-6 py-16 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:py-25">
        <div className="flex max-w-[560px] flex-col items-start gap-4 lg:max-w-[505px]">
          <Eyebrow label={eyebrow} />
          <h2 id="sme-case-study-heading" className="text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-black">
            {heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="text-lg leading-[1.4] tracking-[0.01em] text-grey-500">{body}</p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-[600px] lg:flex-1">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="flex flex-1 flex-col gap-4 rounded-lg bg-grey-100 px-3 py-6 shadow-[inset_0_0_0_1px_rgba(12,42,33,0.06)]"
            >
              <span className="text-sm leading-[1.4] tracking-[0.01em] text-grey-500">{stat.label}</span>
              <span className="text-[28px] font-bold leading-[1.2] tracking-[-0.02em] text-primary-500">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
