import {Check} from "lucide-react";
import {m} from "@/paraglide/messages";
import popoverClose from "@/assets/popover-close.svg";

interface PayoutSelectionBarProps {
  count: number;
  onMarkPaid: () => void;
  onClear: () => void;
}

/** The black bulk-action bar that replaces the toolbar while rows are selected. */
export function PayoutSelectionBar({count, onMarkPaid, onClear}: PayoutSelectionBarProps) {
  return (
    <div
      className="flex items-center justify-between rounded-lg bg-black p-3"
      role="toolbar"
      aria-label={m["payout.selected_count"]({count})}
    >
      <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] whitespace-nowrap text-white">
        {m["payout.selected_count"]({count})}
      </p>
      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={onMarkPaid}
          className="flex h-9 items-center gap-1.5 rounded-md bg-primary-500 px-4 text-sm font-medium text-white"
        >
          <Check className="size-4" aria-hidden="true" />
          {m["payout.mark_paid"]()}
        </button>
        <button type="button" onClick={onClear} aria-label={m["workloads.clear_selection"]()} className="flex items-center">
          <img src={popoverClose} alt="" className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
