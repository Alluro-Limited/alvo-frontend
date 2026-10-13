import type {ReactNode} from "react";
import {AuthHeader} from "./auth-header";
import checkIconUrl from "@/assets/icon-check.svg";
import patternUrl from "@/assets/pattern-success.svg";

interface SuccessScreenProps {
  title: string;
  /** The line(s) under the title; pass fragments for styled spans. */
  description: ReactNode;
  children: ReactNode;
}

/**
 * The patterned success/transition screen shared by "Login Successful!", "You're All Set!"
 * and "Password Updated!": skyline art on top, grey check badge, title + copy, buttons at the bottom.
 */
export function SuccessScreen({title, description, children}: SuccessScreenProps) {
  return (
    <main className="relative flex h-dvh w-full flex-col overflow-hidden bg-white px-6 pt-[65px]">
      <img
        src={patternUrl}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-[-66px] left-1/2 h-[393px] w-[621px] max-w-none -translate-x-1/2 select-none"
      />
      <AuthHeader />
      <div className="relative z-10 mt-8 flex flex-col items-center gap-3">
        <span className="flex size-16 items-center justify-center rounded-full bg-grey-100">
          <img src={checkIconUrl} alt="" aria-hidden="true" className="size-14" />
        </span>
        <div className="flex w-full flex-col gap-2 text-center">
          <h1 className="text-[32px] font-bold leading-[1.1] tracking-[-0.32px] text-foreground">{title}</h1>
          <p className="text-[16px] leading-[1.4] tracking-[0.16px] text-grey-500">{description}</p>
        </div>
      </div>
      <div className="relative z-10 mt-auto mb-6 flex w-full flex-col gap-2.5 pb-[max(0px,env(safe-area-inset-bottom))]">{children}</div>
    </main>
  );
}
