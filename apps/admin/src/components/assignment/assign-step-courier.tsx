import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {AssignableAssignment, IdleCourier} from "@/types/assignment-types";
import wlSearch from "@/assets/wl-search.svg";
import {AssignOptionCard} from "./assign-option-card";
import {AssignStepSkeleton} from "./assign-step-skeleton";

interface AssignStepCourierProps {
  chosen: AssignableAssignment | undefined;
  options: IdleCourier[];
  loading: boolean;
  query: string;
  selected: string | null;
  onQuery: (value: string) => void;
  onSelect: (id: string) => void;
}

/** Step 2: the chosen assignment summary plus the idle-courier pick list. */
export function AssignStepCourier({chosen, options, loading, query, selected, onQuery, onSelect}: AssignStepCourierProps) {
  return (
    <fieldset>
      {chosen && <AssignOptionCard option={chosen} />}
      <div className="relative pt-3">
        <img src={wlSearch} alt="" className="absolute top-[22px] left-3 size-4" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder={m["assignment.assign_courier_search"]()}
          className="w-full rounded-lg border border-grey-200 bg-white py-2.5 pr-3 pl-9 text-sm leading-[1.4] tracking-[0.14px] text-black placeholder:text-grey-400 focus:outline-2 focus:outline-primary-500"
        />
      </div>
      <p className="pt-1.5 text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{m["assignment.assign_courier_hint"]()}</p>
      <div
        className="mt-3 flex max-h-[300px] flex-col gap-2 overflow-y-auto"
        role="radiogroup"
        aria-label={m["assignment.assign_step2_label"]()}
      >
        {loading && <AssignStepSkeleton />}
        {!loading && options.length === 0 && (
          <p className="py-6 text-center text-sm text-grey-500">{m["assignment.assign_courier_empty"]()}</p>
        )}
        {options.map((courier) => (
          <CourierRow key={courier.id} courier={courier} selected={selected === courier.id} onSelect={onSelect} />
        ))}
      </div>
    </fieldset>
  );
}

function CourierRow({courier, selected, onSelect}: {courier: IdleCourier; selected: boolean; onSelect: (id: string) => void}) {
  const initials = courier.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(courier.id)}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors",
        selected ? "border-primary-500 bg-primary-50" : "border-grey-200 bg-white hover:bg-grey-50"
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full border-2",
          selected ? "border-primary-500" : "border-grey-300"
        )}
      >
        {selected && <span className="size-2.5 rounded-full bg-primary-500" />}
      </span>
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-600"
        aria-hidden="true"
      >
        {initials}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-2">
          <span className="text-sm leading-[1.4] font-semibold tracking-[0.14px] text-primary-600">{courier.name}</span>
          <span className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{courier.code}</span>
          <span className="text-xs leading-[1.4] font-medium tracking-[0.12px] text-secondary-500">
            {m["assignment.assign_rank"]({rank: courier.rank})}
          </span>
        </span>
        <span className="block truncate pt-1 text-xs leading-[1.4] tracking-[0.12px] text-grey-500">
          {courier.zones.join(" · ")} · {m["assignment.assign_success_rate"]({rate: courier.successRate})}
        </span>
      </span>
    </button>
  );
}
