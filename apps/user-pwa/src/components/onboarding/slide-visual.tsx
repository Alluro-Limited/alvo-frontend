import patternUrl from "@/assets/pattern-onboarding.svg";
import type {OnboardingSlide} from "./slides";

/** The 520px illustrated top area: teal-tinted skyline pattern, gradient wash, cropped mokker image. */
export function SlideVisual({slide}: {slide: OnboardingSlide}) {
  return (
    <div className="relative h-[520px] w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f5feff] to-transparent" aria-hidden="true" />
      <img
        src={patternUrl}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 h-full w-[820px] max-w-none -translate-x-1/2 select-none"
      />
      <div className="absolute top-[102px] left-1/2 h-[418px] w-[342px] -translate-x-1/2 overflow-hidden rounded-[12px]">
        <img
          src={slide.image}
          alt=""
          className="pointer-events-none absolute left-1/2 w-[1185px] max-w-none -translate-x-1/2 select-none object-cover"
          style={{top: slide.imageTop}}
        />
      </div>
    </div>
  );
}
