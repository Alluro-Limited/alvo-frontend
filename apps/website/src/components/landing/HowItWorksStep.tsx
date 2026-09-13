import {howItWorksContent} from "@/content/landing";

type Step = (typeof howItWorksContent.steps)[number];

export function HowItWorksStep({step, index, active, onSelect}: {step: Step; index: number; active: boolean; onSelect: () => void}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`flex min-h-[200px] flex-col justify-between gap-10 p-6 text-left outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 sm:min-h-[248px] lg:p-8 ${
        active ? "bg-white" : "bg-grey-100 hover:bg-grey-200/60"
      }`}
    >
      <span className={`text-[32px] font-bold leading-none ${active ? "text-black" : "text-grey-300"}`}>{index + 1}</span>
      <span className="flex flex-col gap-2">
        <span className={`text-lg font-medium tracking-[0.01em] ${active ? "text-black" : "text-grey-500"}`}>{step.title}</span>
        <span className={`text-sm leading-[1.4] tracking-[0.01em] ${active ? "text-grey-600" : "text-grey-500"}`}>{step.description}</span>
      </span>
    </button>
  );
}
