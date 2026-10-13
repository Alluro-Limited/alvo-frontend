import {cn} from "cnfast";
import type {OnboardingSlide} from "./slide-data";
import {m} from "@/paraglide/messages";

interface OnboardingSlideViewProps {
  slide: OnboardingSlide;
  index: number;
}

export function OnboardingSlideView({slide, index}: OnboardingSlideViewProps) {
  return (
    <section className="flex h-full flex-col overflow-hidden px-6">
      <div className="relative">
        <h1 className="w-[270px] text-[40px] leading-[46px] font-extrabold tracking-[-0.01em] text-black">{m[slide.titleKey]()}</h1>
        <div className="absolute top-1.5 right-0 flex gap-1" aria-hidden="true">
          {[0, 1, 2].map((segment) => (
            <span key={segment} className={cn("h-1 w-[41px] rounded-full", segment === index ? "bg-primary-500" : "bg-grey-300")} />
          ))}
        </div>
      </div>
      <p className="mt-2 w-full text-[16px] leading-[22px] text-grey-600">{m[slide.subKey]()}</p>
      <div className="flex flex-1 items-center justify-center overflow-hidden">
        <img src={slide.image} alt="" aria-hidden="true" style={{width: slide.imageWidth}} className="max-w-none select-none" />
      </div>
    </section>
  );
}
