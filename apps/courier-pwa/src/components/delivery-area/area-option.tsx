import {MapPin} from "lucide-react";
import type {DeliveryArea} from "@/types/home-types";
import {cn} from "cnfast";

interface AreaOptionProps {
  area: DeliveryArea;
  selected: boolean;
  onSelect: () => void;
}

/** One radio row on Change Delivery Area: pin + name + address + the radio circle. */
export function AreaOption({area, selected, onSelect}: AreaOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="flex w-full items-center gap-3 border-b border-grey-100 px-2 py-4 text-left last:border-0"
    >
      <MapPin className="size-5 shrink-0 text-primary-500" aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold">{area.name}</span>
        <span className="block truncate text-[12px] text-grey-500">{area.address}</span>
      </span>
      <span
        aria-hidden="true"
        className={cn("grid size-5 shrink-0 place-items-center rounded-full border-2", selected ? "border-primary-500" : "border-grey-300")}
      >
        {selected && <span className="size-2.5 rounded-full bg-primary-500" />}
      </span>
    </button>
  );
}
