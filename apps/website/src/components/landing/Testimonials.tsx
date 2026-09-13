import {Eyebrow} from "./Eyebrow";
import {TestimonialWall} from "./TestimonialWall";

import {testimonialsContent} from "@/content/landing";

export function Testimonials() {
  return (
    <section id="testimonials" aria-labelledby="testimonials-heading" className="bg-cream">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-9 overflow-hidden px-6 py-16 md:px-10 lg:py-25">
        <div className="flex max-w-[624px] flex-col items-center gap-3.5 text-center">
          <Eyebrow label={testimonialsContent.eyebrow} />
          <h2
            id="testimonials-heading"
            className="text-[32px] font-bold leading-[1.1] tracking-[-0.01em] text-black sm:text-[38px] lg:text-[42px]"
          >
            {testimonialsContent.heading}
          </h2>
        </div>

        <TestimonialWall />
      </div>
    </section>
  );
}
