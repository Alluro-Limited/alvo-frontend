import {m} from "@/paraglide/messages";
import wlEmptyBox from "@/assets/wl-empty-box.svg";

/** Centered empty panel shown when the filtered list returns no parcels. */
export function WorkloadsEmpty() {
  return (
    <div className="flex min-h-[480px] items-center justify-center rounded-lg bg-white">
      <div className="flex w-[295px] flex-col items-center gap-4 text-center">
        <img src={wlEmptyBox} alt="" className="size-12" aria-hidden="true" />
        <div className="flex flex-col">
          <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{m["workloads.empty_title"]()}</p>
          <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{m["workloads.empty_description"]()}</p>
        </div>
      </div>
    </div>
  );
}
