import {ChevronRight, List} from "lucide-react";
import {m} from "@/paraglide/messages";

/** The teal "View all items" banner button — opens the user's parcels modal. */
export function UserParcelsBanner({count, onOpen}: {count: number; onOpen: () => void}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 rounded-lg bg-primary-50 p-3 text-left text-primary-500 transition-colors hover:bg-primary-100"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/60">
        <List className="size-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base leading-[1.4] font-medium tracking-[0.14px]">{m["users.view_items"]()}</span>
        <span className="block text-xs leading-[1.4] tracking-[0.12px]">
          {count === 1 ? m["users.view_items_sub_one"]({count}) : m["users.view_items_sub"]({count})}
        </span>
      </span>
      <ChevronRight className="size-4 shrink-0" aria-hidden="true" />
    </button>
  );
}
