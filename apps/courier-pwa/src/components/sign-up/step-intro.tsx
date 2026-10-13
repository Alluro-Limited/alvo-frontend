import heroUrl from "@/assets/signup-hero.png";
import {m} from "@/paraglide/messages";

export function StepIntro() {
  return (
    <div className="flex flex-col items-center pt-14 text-center">
      <img src={heroUrl} alt="" aria-hidden="true" className="size-20" />
      <h1 className="mt-7 text-[28px] leading-[35px] font-bold tracking-[-0.01em]">{m["su.intro_title"]()}</h1>
      <p className="mt-2 text-[15px] leading-[22px] text-grey-600">{m["su.intro_desc"]()}</p>
    </div>
  );
}
