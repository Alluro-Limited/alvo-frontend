import {Link} from "@tanstack/react-router";
import {ChevronDown} from "lucide-react";
import bellIconUrl from "@/assets/icon-bell.svg";
import pinIconUrl from "@/assets/icon-pin-fill.svg";
import scanIconUrl from "@/assets/icon-scan.svg";
import {m} from "@/paraglide/messages";

interface HomeHeaderProps {
  /** Current area label, e.g. "Oshodi". */
  area: string;
  onOpenLocation: () => void;
}

/** Floating header over the map: area chip (opens Change Location), scan + notifications icons. */
export function HomeHeader({area, onOpenLocation}: HomeHeaderProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <button type="button" onClick={onOpenLocation} className="flex items-center gap-2">
        <span className="flex items-center gap-0.5">
          <img src={pinIconUrl} alt="" aria-hidden="true" className="size-3.5" />
          <span className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-black whitespace-nowrap">{area}</span>
        </span>
        <ChevronDown className="size-3.5 text-black" aria-hidden="true" />
      </button>
      <div className="flex items-center gap-2">
        <span className="flex items-center overflow-clip rounded-[8px] bg-grey-100 p-2">
          <img src={scanIconUrl} alt="" aria-hidden="true" className="size-5" />
        </span>
        <Link
          to="/notifications"
          aria-label={m["home.notifications"]()}
          className="flex items-center overflow-clip rounded-[8px] bg-grey-100 p-2"
        >
          <img src={bellIconUrl} alt="" aria-hidden="true" className="size-5" />
        </Link>
      </div>
    </div>
  );
}
