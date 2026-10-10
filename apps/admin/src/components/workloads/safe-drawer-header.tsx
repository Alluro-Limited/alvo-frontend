import {DialogClose, DialogTitle} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import type {SafeItemDetail} from "@/types/workloads-types";
import wlClose from "@/assets/wl-close.svg";
import wlFlag from "@/assets/wl-flag.svg";

interface SafeDrawerHeaderProps {
  item: SafeItemDetail | undefined;
  onFlag: () => void;
}

/** Safe drawer title row: "Item details", item id, Flagged pill, flag action, close. */
export function SafeDrawerHeader({item, onFlag}: SafeDrawerHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-grey-200 bg-white px-4 py-3">
      <div className="flex min-w-0 items-center gap-2">
        <DialogTitle className="text-base leading-[1.4] font-semibold whitespace-nowrap text-black">
          {m["workloads.drawer_title_item"]()}
        </DialogTitle>
        {item && <span className="text-sm font-medium tracking-[0.14px] text-grey-600">{item.id}</span>}
        {item?.flag && (
          <span className="rounded-full bg-status-warning-subtle px-2 py-0.5 text-xs font-medium text-status-warning-dark">
            {m["workloads.flagged_tag"]()}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {item && !item.flag && (
          <button type="button" onClick={onFlag} aria-label={m["workloads.flag_item_aria"]()} className="rounded p-1.5 hover:bg-grey-100">
            <img src={wlFlag} alt="" className="size-4" aria-hidden="true" />
          </button>
        )}
        <DialogClose className="rounded p-0.5 hover:bg-grey-100" aria-label={m["workloads.close_drawer_item"]()}>
          <img src={wlClose} alt="" className="size-6" aria-hidden="true" />
        </DialogClose>
      </div>
    </header>
  );
}
