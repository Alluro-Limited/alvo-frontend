import {m} from "@/paraglide/messages";
import popoverClose from "@/assets/popover-close.svg";
import wlFlag from "@/assets/wl-flag.svg";
import wlExport from "@/assets/wl-export.svg";

interface SelectionBarProps {
  count: number;
  onExport: () => void;
  onFlag: () => void;
  onClear: () => void;
}

/** The black bulk-action bar that replaces the toolbar contents while rows are selected. */
export function SelectionBar({count, onExport, onFlag, onClear}: SelectionBarProps) {
  return (
    <div
      className="flex items-center justify-between rounded-lg bg-black p-3"
      role="toolbar"
      aria-label={m["workloads.selected_count"]({count})}
    >
      <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] whitespace-nowrap text-white">
        {m["workloads.selected_count"]({count})}
      </p>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExport}
            className="flex h-9 items-center gap-1.5 rounded-md border-[0.75px] border-status-success px-4 text-sm font-medium text-status-success-dark"
          >
            <img src={wlExport} alt="" className="size-3" aria-hidden="true" />
            {m["workloads.export"]()}
          </button>
          <button
            type="button"
            onClick={onFlag}
            className="flex h-9 items-center gap-1.5 rounded-md border-[0.75px] border-status-warning px-4 text-sm font-medium text-status-warning-dark"
          >
            <img src={wlFlag} alt="" className="size-3" aria-hidden="true" />
            {m["workloads.flag_for_review"]()}
          </button>
        </div>
        <button type="button" onClick={onClear} aria-label={m["workloads.clear_selection"]()} className="flex items-center">
          <img src={popoverClose} alt="" className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
