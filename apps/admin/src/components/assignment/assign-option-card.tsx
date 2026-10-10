import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {AssignableAssignment} from "@/types/assignment-types";
import {AssignmentStatusPill} from "./assignment-status-pill";
import {AssignmentTypePill} from "./assignment-type-pill";

interface AssignOptionCardProps {
  option: AssignableAssignment;
  /** Adds the radio circle + button semantics for step 1; absent renders the plain summary card in step 2. */
  selected?: boolean;
  onSelect?: (id: string) => void;
}

/** The assignment card in the manual-assign modal — selectable radio row in step 1, static summary in step 2. */
export function AssignOptionCard({option, selected, onSelect}: AssignOptionCardProps) {
  const body = (
    <>
      <span className="flex items-center gap-2">
        <span className="text-sm leading-[1.4] font-semibold tracking-[0.14px] text-primary-600">{option.id}</span>
        <AssignmentTypePill type={option.type} />
        <AssignmentStatusPill status={option.status} />
      </span>
      <span className="block truncate pt-1.5 text-sm leading-[1.4] tracking-[0.14px] text-grey-600">{option.route}</span>
      <span className="block pt-0.5 text-xs leading-[1.4] tracking-[0.12px] text-grey-500">
        {option.items === 1 ? m["assignment.items_count_one"]({count: option.items}) : m["assignment.items_count"]({count: option.items})}
      </span>
    </>
  );
  const cardClass = cn(
    "w-full rounded-lg border p-3 text-left",
    selected ? "border-primary-500 bg-primary-50" : "border-grey-200 bg-white"
  );
  if (!onSelect) return <div className={cardClass}>{body}</div>;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected === true}
      onClick={() => onSelect(option.id)}
      className={cn(cardClass, "flex items-start gap-3 transition-colors hover:bg-grey-50", selected && "hover:bg-primary-50")}
    >
      <span
        className={cn(
          "mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full border-2",
          selected ? "border-primary-500" : "border-grey-300"
        )}
      >
        {selected && <span className="size-2.5 rounded-full bg-primary-500" />}
      </span>
      <span className="min-w-0 flex-1">{body}</span>
    </button>
  );
}
