import {Link} from "@tanstack/react-router";
import bellOffUrl from "@/assets/empty-bell.svg";
import {m} from "@/paraglide/messages";

/** "All Quiet Here" empty state with the outlined Go to Home action. */
export function NotifEmpty() {
  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="flex w-[290px] flex-col items-center gap-3 pt-[140px] text-center">
        <img src={bellOffUrl} alt="" aria-hidden="true" className="size-14" />
        <div className="flex w-full flex-col gap-1">
          <p className="text-[16px] font-medium leading-[1.4] tracking-[0.16px] text-black">{m["nt.empty_title"]()}</p>
          <p className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-600">{m["nt.empty_desc"]()}</p>
        </div>
      </div>
      <Link
        to="/home"
        className="mt-auto mb-6 flex h-[50px] w-full items-center justify-center rounded-[8px] border-[0.75px] border-primary-500 px-5 py-3.5 text-[16px] font-medium leading-[1.4] tracking-[0.32px] text-primary-500"
      >
        {m["nt.go_home"]()}
      </Link>
    </div>
  );
}
