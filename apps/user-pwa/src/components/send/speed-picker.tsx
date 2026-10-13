import {cn} from "cnfast";
import type {DeliverySpeed} from "@/types/send-types";
import type {SimpleMessage} from "@/lib/i18n";
import {m} from "@/paraglide/messages";

interface SpeedPickerProps {
  value: DeliverySpeed;
  onChange: (speed: DeliverySpeed) => void;
}

const SPEEDS: {id: DeliverySpeed; labelKey: SimpleMessage}[] = [
  {id: "standard", labelKey: "send.speed_standard"},
  {id: "express", labelKey: "send.speed_express"},
  {id: "same_day", labelKey: "send.speed_same_day"},
];

/** "How fast should we deliver?" segmented control + the extra-fees helper. */
export function SpeedPicker({value, onChange}: SpeedPickerProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <p className="text-[16px] leading-[1.4] tracking-[0.16px] text-primary-800">{m["send.speed_label"]()}</p>
      <div className="flex w-full items-center gap-2" role="radiogroup" aria-label={m["send.speed_label"]()}>
        {SPEEDS.map((s) => (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={value === s.id}
            onClick={() => onChange(s.id)}
            className={cn(
              "flex flex-1 items-center justify-center rounded-[4px] px-6 py-3 text-[12px] font-medium leading-[1.4] tracking-[0.12px]",
              value === s.id ? "bg-[#f2fcfd] text-primary-500" : "bg-grey-100 text-grey-600"
            )}
          >
            {m[s.labelKey]()}
          </button>
        ))}
      </div>
      <p className="text-[12px] leading-[1.4] tracking-[0.12px] text-primary-500">{m["send.speed_help"]()}</p>
    </div>
  );
}
