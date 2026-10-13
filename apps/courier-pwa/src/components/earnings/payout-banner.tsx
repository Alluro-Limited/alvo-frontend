import {Info} from "lucide-react";
import {m} from "@/paraglide/messages";

/** The light-teal explainer: delivery pay credits instantly, auto-withdrawals on the 15th and 30th. */
export function PayoutBanner() {
  return (
    <aside className="flex gap-3 rounded-[8px] bg-[#aaebf1]/30 px-3.5 py-4">
      <Info className="size-5 shrink-0 text-primary-500" aria-hidden="true" />
      <p className="text-[13px] leading-[20px] text-grey-600">
        {m["earnings.info_a"]()}
        <span className="font-medium">{m["earnings.info_days"]()}</span>
        {m["earnings.info_b"]()}
      </p>
    </aside>
  );
}
