import {Link} from "@tanstack/react-router";

import {heroContent} from "@/content/landing";

const tones = {
  onDark: {
    primary: "bg-white text-primary-500",
    divider: "bg-neutral-300",
    secondary: "border border-white text-white",
    icons: {play: "/landing/hero/google-play.svg", appstore: "/landing/hero/appstore.svg", search: "/landing/hero/search.svg"},
  },
  onLight: {
    primary: "bg-primary-500 text-cream",
    divider: "bg-cream/30",
    secondary: "border-[0.75px] border-primary-500 text-primary-500",
    icons: {
      play: "/landing/final-cta/google-play.svg",
      appstore: "/landing/final-cta/appstore.svg",
      search: "/landing/final-cta/search.svg",
    },
  },
} as const;

export function AppCtas({tone = "onDark", className}: {tone?: keyof typeof tones; className?: string}) {
  const t = tones[tone];
  return (
    <div className={`flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4 ${className ?? ""}`}>
      <button
        type="button"
        className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg px-5 py-3.5 text-base font-medium tracking-[0.02em] whitespace-nowrap sm:w-auto ${t.primary}`}
      >
        <span className="inline-flex items-center gap-1">
          <img alt="" aria-hidden="true" className="size-5" src={t.icons.play} />
          <span className={`h-5 w-px ${t.divider}`} />
          <img alt="" aria-hidden="true" className="size-5" src={t.icons.appstore} />
        </span>
        {heroContent.primaryCta}
      </button>
      <Link
        to="/tracking"
        className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-transparent px-5 py-3.5 text-base font-medium tracking-[0.02em] whitespace-nowrap sm:w-auto ${t.secondary}`}
      >
        <img alt="" aria-hidden="true" className="size-5" src={t.icons.search} />
        {heroContent.secondaryCta}
      </Link>
    </div>
  );
}
