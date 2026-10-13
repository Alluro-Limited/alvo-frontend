import {useState} from "react";
import {Link, useNavigate} from "@tanstack/react-router";
import {Button} from "@alvo/ui";
import {cn} from "cnfast";
import {SlideVisual} from "@/components/onboarding/slide-visual";
import {ONBOARDING_SLIDES} from "@/components/onboarding/slides";
import {m} from "@/paraglide/messages";

/**
 * Three-slide onboarding carousel. "Get Started" advances to the next slide and lands on
 * sign-up after the last one; "Log in" skips straight to sign-in.
 */
export function OnboardingPage() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const slide = ONBOARDING_SLIDES[index];
  const last = index === ONBOARDING_SLIDES.length - 1;

  const next = () => {
    if (last) {
      void navigate({to: "/sign-up"});
      return;
    }
    setIndex((i) => i + 1);
  };

  return (
    <main className="flex h-dvh w-full flex-col overflow-hidden bg-white">
      <SlideVisual slide={slide} />
      <div className="mt-[50px] flex flex-1 flex-col items-center gap-4 px-6">
        <div className="flex w-full flex-col items-center gap-6">
          <div className="flex w-full flex-col items-center gap-2 text-center">
            <h1 className="text-[28px] font-medium leading-[1.2] tracking-[-0.28px] text-foreground">{m[slide.titleKey]()}</h1>
            <p className="text-[16px] leading-[1.4] tracking-[0.16px] text-grey-600">{m["onb.desc"]()}</p>
          </div>
          <div className="flex items-center gap-1" aria-hidden="true">
            {ONBOARDING_SLIDES.map((s, i) => (
              <span key={s.titleKey} className={cn("h-1 rounded-[1px]", i === index ? "w-[60px] bg-primary-500" : "w-8 bg-grey-300")} />
            ))}
          </div>
          <Button className="w-full text-[16px] font-medium" onClick={next}>
            {m["onb.get_started"]()}
          </Button>
        </div>
        <p className="flex items-center gap-1 text-[14px] leading-[1.4] tracking-[0.14px] whitespace-nowrap">
          <span className="text-grey-500">{m["onb.have_account"]()}</span>
          <Link to="/sign-in" className="font-bold text-primary-500">
            {m["onb.login"]()}
          </Link>
        </p>
      </div>
    </main>
  );
}
