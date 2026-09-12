import {courierStepsContent} from "@/content/courier";

type Step = (typeof courierStepsContent.steps)[number];

export function CourierStepProgress({
  steps,
  active,
  onSelect,
}: {
  steps: readonly Step[];
  active: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-2.5">
      {steps.map((step, index) => (
        <button
          key={step.id}
          type="button"
          onClick={() => onSelect(index)}
          aria-label={`Show step ${index + 1}: ${step.title}`}
          aria-current={index === active ? "step" : undefined}
          className="flex items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50"
        >
          <span
            className={`rounded-full transition-all duration-300 ${index === active ? "h-2 w-12 bg-teal-500" : "size-2 bg-grey-300"}`}
          />
        </button>
      ))}
    </div>
  );
}
