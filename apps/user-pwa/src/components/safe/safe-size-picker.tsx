import {Check} from "lucide-react";
import {cn} from "cnfast";
import type {SafeSize, SafeSizeOption} from "@/types/safe-types";
import {naira} from "@/lib/money";
import {m} from "@/paraglide/messages";
import boxSmallUrl from "@/assets/box-small.svg";
import boxMediumUrl from "@/assets/box-medium.svg";
import boxBigUrl from "@/assets/box-big.svg";

const ICONS: Record<SafeSize, string> = {small: boxSmallUrl, medium: boxMediumUrl, large: boxBigUrl};

interface SafeSizePickerProps {
  sizes: SafeSizeOption[];
  value: SafeSize | null;
  onChange: (size: SafeSize) => void;
}

/** "Locker Size" — the three radio cards with hourly pricing. */
export function SafeSizePicker({sizes, value, onChange}: SafeSizePickerProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <p className="text-[16px] leading-[1.4] tracking-[0.16px] text-primary-800">{m["safe.size_label"]()}</p>
      <div className="flex w-full flex-col gap-4" role="radiogroup" aria-label={m["safe.size_label"]()}>
        {sizes.map((size) => (
          <SizeOption key={size.id} size={size} selected={value === size.id} onPick={onChange} />
        ))}
      </div>
    </div>
  );
}

function SizeOption({size, selected, onPick}: {size: SafeSizeOption; selected: boolean; onPick: (size: SafeSize) => void}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onPick(size.id)}
      className={cn(
        "flex w-full items-center gap-3 rounded-[8px] border-[0.75px] p-4",
        selected ? "border-primary-500 bg-[#f9f9f9]" : "border-grey-300 bg-white"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded-full border",
          selected ? "border-primary-500 bg-primary-500 text-white" : "border-grey-300 bg-white"
        )}
      >
        {selected ? <Check className="size-2.5" strokeWidth={3.5} aria-hidden="true" /> : null}
      </span>
      <img src={ICONS[size.id]} alt="" aria-hidden="true" className="size-10" />
      <span className="flex min-w-0 flex-1 flex-col items-start text-left">
        <span className="text-[16px] font-medium leading-[1.4] tracking-[0.16px] text-foreground">{size.label}</span>
        <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500">{size.dims}</span>
      </span>
      <span className="text-[16px] font-bold leading-[1.4] tracking-[0.32px] text-primary-500">{`${naira(size.hourlyRate)}/hr`}</span>
    </button>
  );
}
