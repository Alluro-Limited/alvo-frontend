import {m} from "@/paraglide/messages";
import type {AssignableAssignment} from "@/types/assignment-types";
import {AssignOptionCard} from "./assign-option-card";
import {AssignStepSkeleton} from "./assign-step-skeleton";

interface AssignStepAssignmentProps {
  options: AssignableAssignment[];
  loading: boolean;
  selected: string | null;
  onSelect: (id: string) => void;
}

/** Step 1: pick which assignable assignment the courier should take. */
export function AssignStepAssignment({options, loading, selected, onSelect}: AssignStepAssignmentProps) {
  return (
    <fieldset>
      <p className="text-sm leading-[1.4] tracking-[0.14px] text-grey-600">{m["assignment.assign_step1_hint"]()}</p>
      <div
        className="mt-3 flex max-h-[340px] flex-col gap-2 overflow-y-auto"
        role="radiogroup"
        aria-label={m["assignment.assign_step1_label"]()}
      >
        {loading && <AssignStepSkeleton />}
        {!loading && options.length === 0 && (
          <p className="py-6 text-center text-sm text-grey-500">{m["assignment.assign_step1_empty"]()}</p>
        )}
        {options.map((option) => (
          <AssignOptionCard key={option.id} option={option} selected={selected === option.id} onSelect={onSelect} />
        ))}
      </div>
    </fieldset>
  );
}
