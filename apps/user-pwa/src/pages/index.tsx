import {useEffect} from "react";
import {useNavigate} from "@tanstack/react-router";
import lettermarkUrl from "@/assets/logo-lettermark.svg";
import logoIconUrl from "@/assets/logo-icon.svg";
import patternUrl from "@/assets/pattern-splash.svg";
import {m} from "@/paraglide/messages";

const SPLASH_DURATION_MS = 1800;

/** Branded splash: skyline pattern along the bottom, centered mark, auto-advances to onboarding. */
export function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => void navigate({to: "/onboarding", replace: true}), SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden bg-white">
      <img
        src={patternUrl}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 w-[140%] max-w-none -translate-x-1/2 select-none"
      />
      <div className="relative z-10 flex items-center gap-[14px]">
        <img src={logoIconUrl} alt="" aria-hidden="true" className="h-10 w-[43px] select-none" />
        <img src={lettermarkUrl} alt={m["app.title"]()} className="h-[31px] w-[143px] select-none" />
      </div>
      <p className="absolute bottom-15 z-10 w-full text-center text-[12px] leading-[1.4] tracking-[0.12px] text-grey-600">
        {m["splash.version"]()}
      </p>
    </main>
  );
}
