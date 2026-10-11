import type {ReactNode} from "react";

/**
 * Floating error banner from the verification design: it sits at the top of the
 * right pane (which is `relative`), not inside the card flow.
 */
export function VerificationBanner({title, children}: {title: string; children: ReactNode}) {
  return (
    <div
      role="alert"
      className="absolute top-8 left-1/2 z-10 w-[342px] max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-xl border-[0.5px] border-status-fail bg-status-fail-subtle p-4"
    >
      <p className="text-base leading-[1.4] font-medium tracking-[0.01em] text-primary-900">{title}</p>
      <p className="mt-0.5 text-sm leading-[1.4] tracking-[0.01em] text-primary-900/70">{children}</p>
    </div>
  );
}
