import {ChevronRight, List} from "lucide-react";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {DeliveryType} from "@/types/assignment-types";
import {TYPE_TONES} from "./assignment-type-pill";

/** The tinted "View all items" banner button — opens the items modal. */
export function ViewItemsBanner({type, count, onOpen}: {type: DeliveryType; count: number; onOpen: () => void}) {
  const tone = TYPE_TONES[type];
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn("flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors", tone.classes, "hover:opacity-90")}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/60">
        <List className="size-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm leading-[1.4] font-medium tracking-[0.14px]">{m["assignment.view_items"]()}</span>
        <span className="block text-xs leading-[1.4] tracking-[0.12px] opacity-80">
          {count === 1 ? m["assignment.view_items_sub_one"]({count}) : m["assignment.view_items_sub"]({count})}
        </span>
      </span>
      <ChevronRight className="size-4 shrink-0" aria-hidden="true" />
    </button>
  );
}
