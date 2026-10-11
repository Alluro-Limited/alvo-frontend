import type {ReactNode} from "react";
import {Link} from "@tanstack/react-router";
import {ChevronLeft} from "lucide-react";
import {cn} from "cnfast";

import {m} from "@/paraglide/messages";

export type SignUpStepId = "business" | "personal" | "verify";

const steps: {id: SignUpStepId; label: () => string}[] = [
  {id: "business", label: m["sign_up.step_business"]},
  {id: "personal", label: m["sign_up.step_contact"]},
  {id: "verify", label: m["sign_up.step_verification"]},
];

function StepDot({state}: {state: "done" | "active" | "todo"}) {
  if (state === "todo") {
    return <span className="size-5 shrink-0 rounded-full border-[0.75px] border-grey-300 bg-white" aria-hidden="true" />;
  }
  if (state === "done") {
    return <span className="size-5 shrink-0 rounded-full border-[1.5px] border-primary-200 bg-white" aria-hidden="true" />;
  }
  return (
    <span
      className="flex size-5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-cream bg-primary-500"
      aria-hidden="true"
    >
      <span className="size-2.5 rounded-full bg-white" />
    </span>
  );
}

/**
 * Split layout for the sign-up flow: a teal progress panel on desktop and the step's
 * form on the right. The right pane is `relative` so step banners can float over it.
 */
export function SignUpLayout({step, children}: {step: SignUpStepId; children: ReactNode}) {
  const stepIndex = steps.findIndex((s) => s.id === step);
  return (
    <main className="flex min-h-screen bg-background">
      <aside className="hidden w-[42%] bg-primary-500 lg:block">
        <div className="flex h-full flex-col justify-between px-20 py-[100px]">
          <Link to="/" className="flex w-fit items-center gap-1 text-white">
            <ChevronLeft className="size-5" strokeWidth={1.5} aria-hidden="true" />
            <span className="text-base leading-[1.4] tracking-[0.01em]">{m["sign_up.home"]()}</span>
          </Link>
          <div className="flex flex-col gap-6">
            <p className="text-xl leading-[1.2] font-bold text-white">{m["sign_up.side_title"]()}</p>
            <ol className="flex flex-col gap-4">
              {steps.map((s, i) => {
                const state = i < stepIndex ? "done" : i === stepIndex ? "active" : "todo";
                return (
                  <li key={s.id} className="flex items-center gap-3" aria-current={state === "active" ? "step" : undefined}>
                    <StepDot state={state} />
                    <span
                      className={cn(
                        "text-sm leading-[1.4] font-medium tracking-[0.01em] whitespace-nowrap",
                        state === "done" ? "text-primary-400 line-through" : "text-white"
                      )}
                    >
                      {s.label()}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
          <div className="flex flex-col gap-4">
            <p className="w-fit rounded-full bg-cream px-2 py-1 text-xs leading-[1.4] font-medium tracking-[0.08em] text-primary-500">
              {m["login.badge"]()}
            </p>
            <p className="max-w-[330px] text-[32px] leading-[1.1] font-medium tracking-[-0.01em] text-white">
              {m["sign_up.hero_from"]()}
              <em className="text-primary-50">{m["sign_up.hero_drop_off"]()}</em>
              {m["sign_up.hero_to"]()}
              <em className="text-primary-50">{m["sign_up.hero_delivery"]()}</em>
              {m["sign_up.hero_suffix"]()}
            </p>
          </div>
        </div>
      </aside>
      <div className="relative flex flex-1 items-center justify-center px-4 py-10 sm:px-8">{children}</div>
    </main>
  );
}
