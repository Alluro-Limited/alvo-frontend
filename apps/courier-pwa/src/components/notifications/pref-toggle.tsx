import {cn} from "cnfast";

interface PrefToggleProps {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}

/** The teal 39x24 switch used on the Notification settings rows. */
export function PrefToggle({checked, label, onChange}: PrefToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn("relative h-[24px] w-[39px] shrink-0 rounded-full transition-colors", checked ? "bg-primary-500" : "bg-grey-400")}
    >
      <span
        aria-hidden="true"
        className={cn("absolute top-[2px] size-[20px] rounded-full bg-white transition-all", checked ? "right-[2px]" : "left-[2px]")}
      />
    </button>
  );
}
