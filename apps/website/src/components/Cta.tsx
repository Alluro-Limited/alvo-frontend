import {type ReactNode} from "react";

export type CtaContent = {
  heading: string | readonly string[];
  subhead: string;
};

type CtaProps = CtaContent & {
  id?: string;
  className?: string;
  background: ReactNode;
  children: ReactNode;
};

export function Cta({id, heading, subhead, className, background, children}: CtaProps) {
  const headingId = id ? `${id}-heading` : undefined;

  return (
    <section aria-labelledby={headingId} className="bg-white">
      <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 lg:px-30 lg:py-20">
        <div className={`relative mx-auto flex max-w-[1080px] flex-col justify-end overflow-hidden rounded-3xl p-4 ${className ?? ""}`}>
          {background}

          <div className="relative flex flex-col items-center gap-6 rounded-2xl bg-cream p-8 text-center sm:p-10">
            <div className="flex max-w-[446px] flex-col gap-3">
              <h2
                id={headingId}
                className="text-[28px] font-bold leading-[1.1] tracking-[-0.01em] text-black sm:text-[36px] lg:text-[42px]"
              >
                {typeof heading === "string"
                  ? heading
                  : heading.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
              </h2>
              <p className="text-base leading-[1.4] tracking-[0.01em] text-black sm:text-lg">{subhead}</p>
            </div>

            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
