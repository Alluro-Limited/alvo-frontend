import {cn} from "cnfast";

interface PilledTabsProps<T extends string> {
  value: T;
  options: {value: T; label: string}[];
  onChange: (value: T) => void;
  ariaLabel: string;
  /** `accent` = white bar with the pale-teal active chip; `plain` = grey bar with a white chip (chart filters). */
  variant?: "accent" | "plain";
}

/** The Figma "Pilled Bar" — segmented pills for the page tabs, period ranges, and chart filters. */
export function PilledTabs<T extends string>({value, options, onChange, ariaLabel, variant = "accent"}: PilledTabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn("flex h-10 items-center gap-0.5 rounded-lg p-1", variant === "accent" ? "bg-white" : "bg-grey-100")}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex h-8 items-center justify-center rounded-lg px-4 text-sm leading-[1.4] tracking-[0.14px] whitespace-nowrap transition-colors",
              active
                ? variant === "accent"
                  ? "bg-[#f6fdfd] font-medium text-primary-500"
                  : "bg-white font-medium text-black shadow-[0_1px_2px_rgba(16,24,40,0.06)]"
                : "text-grey-600 hover:text-grey-800"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
