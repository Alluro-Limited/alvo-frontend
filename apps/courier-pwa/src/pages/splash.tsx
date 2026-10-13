import {useEffect} from "react";
import {useNavigate} from "@tanstack/react-router";
import cityscapeUrl from "@/assets/splash-cityscape.png";
import logoUrl from "@/assets/alvo-go-logo.png";
import {m} from "@/paraglide/messages";

const SPLASH_DURATION_MS = 1800;

export function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => void navigate({to: "/onboarding", replace: true}), SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden bg-primary-500">
      <img
        src={cityscapeUrl}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 w-[550px] max-w-none -translate-x-1/2 select-none"
      />
      <img src={logoUrl} alt={m["app.title"]()} className="relative z-10 w-[138px] select-none" />
      <p className="absolute bottom-12 left-0 z-10 w-full text-center text-[14px] leading-[20px] text-white/90">{m["splash.tagline"]()}</p>
    </main>
  );
}
