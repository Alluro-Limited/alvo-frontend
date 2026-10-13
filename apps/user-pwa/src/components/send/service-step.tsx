import {Check} from "lucide-react";
import {m} from "@/paraglide/messages";

/** Step 1 — "How would you like to send?" Locker to Locker vs the coming-soon Door to Locker. */
export function ServiceStep() {
  return (
    <div className="flex w-full flex-col gap-2">
      <button
        type="button"
        role="radio"
        aria-checked="true"
        className="flex w-full flex-col items-start gap-2 rounded-[8px] border border-primary-500 bg-cream p-4 text-left"
      >
        <span className="flex w-full items-center gap-2.5">
          <span className="flex-1 text-[18px] font-bold leading-[1.2] text-foreground">{m["send.l2l"]()}</span>
          <span
            aria-hidden="true"
            className="flex size-[22px] items-center justify-center rounded-full border border-primary-500 bg-primary-500 text-white"
          >
            <Check className="size-3" strokeWidth={3} aria-hidden="true" />
          </span>
        </span>
        <span className="w-full text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">
          {m["send.l2l_desc"]()}
          <br />
          {m["send.l2l_tag"]()}
        </span>
      </button>
      <div
        aria-disabled="true"
        className="flex w-full flex-col items-start gap-2 rounded-[8px] border-[0.75px] border-grey-200 bg-white p-4"
      >
        <span className="flex w-full items-center gap-2.5">
          <span className="flex-1 text-[18px] font-bold leading-[1.2] text-foreground">{m["send.d2l"]()}</span>
          <span className="flex items-center justify-center rounded-[24px] bg-[rgba(152,223,229,0.3)] px-4 py-2 text-[10px] font-medium leading-[1.4] tracking-[0.2px] text-primary-500 whitespace-nowrap">
            {m["send.coming_soon"]()}
          </span>
        </span>
        <span className="w-full text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">{m["send.d2l_desc"]()}</span>
      </div>
    </div>
  );
}
