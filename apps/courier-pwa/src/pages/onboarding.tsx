import {Button} from "@alvo/ui";
import {Link} from "@tanstack/react-router";
import {OnboardingSlideView} from "@/components/onboarding/onboarding-slide";
import {ONBOARDING_SLIDES} from "@/components/onboarding/slide-data";
import {m} from "@/paraglide/messages";

export function OnboardingPage() {
  return (
    <main className="flex h-dvh w-full flex-col bg-white">
      <div className="flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {ONBOARDING_SLIDES.map((slide, index) => (
          <div key={slide.titleKey} className="h-full w-full shrink-0 snap-start pt-[calc(env(safe-area-inset-top)+2.5rem)]">
            <OnboardingSlideView slide={slide} index={index} />
          </div>
        ))}
      </div>
      <footer className="px-6 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <Button render={<Link to="/sign-up" />} nativeButton={false} className="h-[50px] w-full text-[16px]">
          {m["ob.cta"]()}
        </Button>
        <p className="mt-4 text-center text-[14px] leading-[20px] text-grey-600">
          {m["ob.login_prefix"]()}{" "}
          <Link to="/sign-in" className="font-medium text-primary-500">
            {m["ob.login_link"]()}
          </Link>
        </p>
      </footer>
    </main>
  );
}
