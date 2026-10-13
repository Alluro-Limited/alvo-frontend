import {Search} from "lucide-react";
import {cn} from "cnfast";
import type {SimpleMessage} from "@/lib/i18n";
import {m} from "@/paraglide/messages";

export type NodeFilter = "all" | "near" | "favorites";

const FILTERS: {id: NodeFilter; labelKey: SimpleMessage}[] = [
  {id: "all", labelKey: "send.chip_all"},
  {id: "near", labelKey: "send.chip_near"},
  {id: "favorites", labelKey: "send.chip_fav"},
];

interface NodeSearchProps {
  query: string;
  filter: NodeFilter;
  onQuery: (query: string) => void;
  onFilter: (filter: NodeFilter) => void;
}

/** The search field + All/Near Me/Favorites chips inside the Select Locker sheet. */
export function NodeSearch({query, filter, onQuery, onFilter}: NodeSearchProps) {
  return (
    <>
      <div className="mt-4 flex w-full items-center gap-2 overflow-clip rounded-[8px] border-[0.75px] border-grey-300 px-4 py-3.5 focus-within:border-primary-500">
        <Search className="size-[22px] shrink-0 text-grey-500" aria-hidden="true" />
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder={m["send.search_ph"]()}
          aria-label={m["send.search_ph"]()}
          className="min-w-0 flex-1 bg-transparent text-[14px] leading-[1.4] tracking-[0.14px] text-foreground placeholder:text-grey-500 focus:outline-none"
        />
      </div>
      <div className="mt-4 flex items-center gap-2" role="radiogroup" aria-label={m["send.node_sheet"]()}>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="radio"
            aria-checked={filter === f.id}
            onClick={() => onFilter(f.id)}
            className={cn(
              "flex items-center justify-center rounded-[4px] px-4 py-2 text-[12px] font-medium leading-[1.4] tracking-[0.12px]",
              filter === f.id ? "bg-primary-500 text-white" : "border border-grey-100 text-foreground"
            )}
          >
            {m[f.labelKey]()}
          </button>
        ))}
      </div>
    </>
  );
}
