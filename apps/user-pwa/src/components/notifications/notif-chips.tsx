import {cn} from "cnfast";
import {m} from "@/paraglide/messages";

export type NotifFilter = "all" | "delivery" | "payment";

const CHIPS: {id: NotifFilter; labelKey: "nt.all" | "nt.deliveries" | "nt.payment"}[] = [
  {id: "all", labelKey: "nt.all"},
  {id: "delivery", labelKey: "nt.deliveries"},
  {id: "payment", labelKey: "nt.payment"},
];

/** All / Deliveries / Payment filter chips; the active one is solid teal. */
export function NotifChips({value, onChange}: {value: NotifFilter; onChange: (v: NotifFilter) => void}) {
  return (
    <div className="flex items-center gap-2" role="group" aria-label={m["nt.filters"]()}>
      {CHIPS.map((chip) => (
        <button
          key={chip.id}
          type="button"
          aria-pressed={value === chip.id}
          onClick={() => onChange(chip.id)}
          className={cn(
            "flex items-center justify-center rounded-[4px] px-4 py-2 text-[12px] font-medium leading-[1.4] tracking-[0.12px]",
            value === chip.id ? "bg-primary-500 text-white" : "border border-grey-100 text-black"
          )}
        >
          {m[chip.labelKey]()}
        </button>
      ))}
    </div>
  );
}
