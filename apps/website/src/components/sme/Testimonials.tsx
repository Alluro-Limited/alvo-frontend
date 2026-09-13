import {Star} from "lucide-react";

import {Eyebrow} from "@/components/landing/Eyebrow";
import {smeTestimonialsContent} from "@/content/sme";

type Testimonial = (typeof smeTestimonialsContent.testimonials)[number];

function TestimonialCard({testimonial}: {testimonial: Testimonial}) {
  return (
    <div className="flex flex-col justify-between gap-10 rounded-2xl border border-grey-300 bg-white p-6">
      <div className="flex flex-col gap-6">
        <div className="flex gap-0.5">
          {Array.from({length: 5}).map((_, i) => (
            <Star key={i} className="size-[15px] text-primary-500" fill="currentColor" stroke="none" />
          ))}
        </div>
        <div className="flex flex-col gap-0.5">
          {testimonial.quote.map((line) => (
            <p key={line} className="text-base leading-[1.4] tracking-[0.01em] text-black">
              {line}
            </p>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="size-10 rounded-full bg-primary-500" />
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-black">{testimonial.name}</span>
          <span className="text-xs text-grey-500">{testimonial.role}</span>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const {eyebrow, heading, testimonials} = smeTestimonialsContent;
  return (
    <section aria-labelledby="sme-testimonials-heading" className="bg-grey-100">
      <div className="mx-auto flex max-w-[1202px] flex-col items-center gap-10 px-6 py-16 md:px-10 lg:gap-12 lg:py-25">
        <div className="flex max-w-[720px] flex-col items-center gap-5 text-center">
          <Eyebrow label={eyebrow} />
          <h2 id="sme-testimonials-heading" className="text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-black sm:text-[42px]">
            {heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
