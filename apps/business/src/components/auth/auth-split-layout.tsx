import type {ReactNode} from "react";
import heroUrl from "@/assets/login-hero.jpg";

interface AuthSplitLayoutProps {
  /** Pill label pinned to the top of the hero panel, e.g. "BULK SEND PORTAL". */
  badge: string;
  headline: string;
  tagline: string;
  children: ReactNode;
}

/**
 * Split-screen auth shell: a teal-treated hero panel on the left (desktop only, ~42% like
 * the 604/1440 Figma frame) with the badge up top and the pitch at the bottom, and the
 * form column centered on the right.
 */
export function AuthSplitLayout({badge, headline, tagline, children}: AuthSplitLayoutProps) {
  return (
    <main className="flex min-h-screen bg-background">
      <aside className="relative hidden w-[42%] overflow-hidden lg:block">
        <img
          src={heroUrl}
          alt=""
          aria-hidden="true"
          decoding="async"
          className="absolute inset-0 size-full object-cover object-[57%_center]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-primary-500 mix-blend-hue" />
        <div className="relative flex h-full flex-col justify-between p-16">
          <p className="w-fit rounded-full bg-primary-500 px-2 py-1 text-xs leading-[1.4] tracking-[0.01em] text-white">{badge}</p>
          <div className="flex flex-col gap-2 text-white">
            <p className="text-[32px] leading-[1.1] font-bold tracking-[-0.01em]">{headline}</p>
            <p className="text-base leading-[1.4] tracking-[0.01em]">{tagline}</p>
          </div>
        </div>
      </aside>
      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">{children}</div>
    </main>
  );
}
