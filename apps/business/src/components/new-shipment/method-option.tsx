import {cn} from "cnfast";

function RadioDot({selected}: {selected: boolean}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-[22px] shrink-0 items-center justify-center rounded-full border-[1.5px]",
        selected ? "border-primary-500" : "border-grey-300"
      )}
    >
      {selected && <span className="size-3 rounded-full bg-primary-500" />}
    </span>
  );
}

interface MethodOptionProps {
  icon: string;
  title: string;
  sub: string;
  selected: boolean;
  onSelect: () => void;
}

/** A payment-method card: icon, title/subtitle, and a radio indicator. */
export function MethodOption({icon, title, sub, selected, onSelect}: MethodOptionProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-4 rounded border-[0.75px] p-3 text-left",
        selected ? "border-primary-500" : "border-grey-300"
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-grey-100 p-1.5">
        <img src={icon} alt="" aria-hidden="true" className="size-6" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="w-full text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{title}</span>
        <span className="w-full text-[10px] leading-[1.4] tracking-[0.1px] text-black opacity-50">{sub}</span>
      </span>
      <RadioDot selected={selected} />
    </button>
  );
}
