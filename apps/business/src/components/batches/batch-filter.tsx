import {ChevronDown, Search} from "lucide-react";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {BatchFilter, BatchPeriod} from "@/types/batch-types";

const FILTER_TABS: {id: BatchFilter; label: () => string}[] = [
  {id: "all", label: m["batches.filter_all"]},
  {id: "active", label: m["batches.filter_active"]},
  {id: "completed", label: m["batches.filter_completed"]},
  {id: "draft", label: m["batches.filter_draft"]},
];

const PERIODS: {id: BatchPeriod; label: () => string}[] = [
  {id: "7d", label: m["batches.period_7d"]},
  {id: "30d", label: m["batches.period_30d"]},
  {id: "90d", label: m["batches.period_90d"]},
  {id: "all", label: m["batches.period_all"]},
];

interface BatchFilterBarProps {
  filter: BatchFilter;
  onFilter: (filter: BatchFilter) => void;
  search: string;
  onSearch: (search: string) => void;
  /** Search input placeholder — the list searches batches, the detail searches recipients. */
  placeholder: string;
  period?: BatchPeriod;
  onPeriod?: (period: BatchPeriod) => void;
}

function PeriodSelect({period, onPeriod}: {period: BatchPeriod; onPeriod: (period: BatchPeriod) => void}) {
  return (
    <label className="relative flex h-10 w-[143px] items-center rounded-lg border-[0.75px] border-grey-300 px-4">
      <select
        value={period}
        onChange={(event) => onPeriod(event.target.value as BatchPeriod)}
        aria-label={m["batches.period_30d"]()}
        className="w-full appearance-none bg-transparent text-sm leading-[1.4] tracking-[0.14px] text-grey-500 outline-none"
      >
        {PERIODS.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label()}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 size-5 text-grey-500" aria-hidden="true" />
    </label>
  );
}

/** Status chips + search box (+ optional period picker) above a table. */
export function BatchFilterBar({filter, onFilter, search, onSearch, placeholder, period, onPeriod}: BatchFilterBarProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-start gap-6">
        <div className="flex items-center gap-2 self-stretch" role="tablist" aria-label={m["batches.filter_all"]()}>
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={filter === tab.id}
              onClick={() => onFilter(tab.id)}
              className={cn(
                "flex h-full items-center justify-center rounded px-3 py-1.5 text-xs leading-[1.4] font-medium tracking-[0.12px]",
                filter === tab.id ? "bg-primary-500 text-white" : "border border-grey-300 text-black"
              )}
            >
              {tab.label()}
            </button>
          ))}
        </div>
        <label className="flex h-10 w-[348px] items-center gap-2 rounded-lg border-[0.75px] border-grey-300 px-4">
          <Search className="size-[22px] shrink-0 text-grey-400" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
            className="w-full text-sm leading-[1.4] tracking-[0.14px] text-black outline-none placeholder:text-grey-500"
          />
        </label>
      </div>
      {period !== undefined && onPeriod !== undefined && <PeriodSelect period={period} onPeriod={onPeriod} />}
    </div>
  );
}
