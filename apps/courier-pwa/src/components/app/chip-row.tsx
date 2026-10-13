import {cn} from "cnfast";

export interface ChipOption<T extends string> {
  value: T;
  label: string;
}

interface ChipRowProps<T extends string> {
  value: T;
  options: ChipOption<T>[];
  onChange: (v: T) => void;
}

/** The 33px filter chips used on Jobs, Deliveries and Notifications — teal when active. */
export function ChipRow<T extends string>({value, options, onChange}: ChipRowProps<T>) {
  return (
    <div className="flex gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "h-[33px] rounded-[8px] px-4 text-[14px] font-medium transition-colors",
            value === o.value ? "bg-primary-500 text-white" : "bg-white text-foreground"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
