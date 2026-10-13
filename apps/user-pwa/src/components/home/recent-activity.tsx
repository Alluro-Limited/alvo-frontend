import {Link} from "@tanstack/react-router";
import boxesIconUrl from "@/assets/empty-boxes.svg";
import {m} from "@/paraglide/messages";

/** "Recent Activity / See all" section — empty state until the user has activity. */
export function RecentActivity() {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full items-center justify-between">
        <span className="text-[16px] leading-[1.4] tracking-[0.16px] text-grey-500">{m["home.recent"]()}</span>
        <Link to="/activities" className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-primary-500">
          {m["home.see_all"]()}
        </Link>
      </div>
      <div className="flex h-[260px] w-full items-center justify-center rounded-[8px]">
        <div className="flex w-[110px] flex-col items-center">
          <img src={boxesIconUrl} alt="" aria-hidden="true" className="size-14" />
          <p className="mt-2 w-full text-center text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500">{m["home.no_activity"]()}</p>
        </div>
      </div>
    </div>
  );
}
