import {Check, Info} from "lucide-react";
import {cn} from "cnfast";
import type {PackageSize} from "@/types/send-types";
import type {SimpleMessage} from "@/lib/i18n";
import {m} from "@/paraglide/messages";
import boxSmallUrl from "@/assets/box-small.svg";
import boxMediumUrl from "@/assets/box-medium.svg";
import boxBigUrl from "@/assets/box-big.svg";

const SIZES: {id: PackageSize; labelKey: SimpleMessage; icon: string}[] = [
  {id: "small", labelKey: "send.size_small", icon: boxSmallUrl},
  {id: "medium", labelKey: "send.size_medium", icon: boxMediumUrl},
  {id: "large", labelKey: "send.size_large", icon: boxBigUrl},
];

/** "Package Size" radio cards (icon + name + dims) with the dimension-guide link. */
export function SizePicker({value, onChange}: {value: PackageSize | null; onChange: (size: PackageSize) => void}) {
  return (
    <div className="flex w-full flex-col gap-3">
      <p className="text-[16px] leading-[1.4] tracking-[0.16px] text-primary-800">{m["send.size_label"]()}</p>
      <div className="flex w-full flex-col gap-4" role="radiogroup" aria-label={m["send.size_label"]()}>
        {SIZES.map((s) => (
          <SizeOption key={s.id} id={s.id} labelKey={s.labelKey} icon={s.icon} selected={value === s.id} onPick={onChange} />
        ))}
      </div>
      <div className="flex items-center gap-0.5">
        <Info className="size-4 text-primary-500" aria-hidden="true" />
        <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-primary-500">{m["send.dim_guide"]()}</span>
      </div>
    </div>
  );
}

function SizeOption({
  id,
  labelKey,
  icon,
  selected,
  onPick,
}: {
  id: PackageSize;
  labelKey: SimpleMessage;
  icon: string;
  selected: boolean;
  onPick: (size: PackageSize) => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onPick(id)}
      className={cn(
        "flex w-full items-center justify-between rounded-[8px] border-[0.75px] p-4",
        selected ? "border-primary-500 bg-cream" : "border-[#f9f9f9] bg-[#f9f9f9]"
      )}
    >
      <span className="flex items-end gap-3">
        <img src={icon} alt="" aria-hidden="true" className="size-10" />
        <span className="flex flex-col items-start">
          <span className="text-[16px] font-medium leading-[1.4] tracking-[0.16px] text-foreground">{m[labelKey]()}</span>
          <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500">{m["send.size_dims"]()}</span>
        </span>
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "flex size-[22px] items-center justify-center rounded-full border",
          selected ? "border-primary-500 bg-primary-500 text-white" : "border-grey-300 bg-white"
        )}
      >
        {selected ? <Check className="size-3" strokeWidth={3} aria-hidden="true" /> : null}
      </span>
    </button>
  );
}
