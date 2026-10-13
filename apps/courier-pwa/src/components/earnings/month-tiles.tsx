import {CalendarDays, Package} from "lucide-react";
import {m} from "@/paraglide/messages";

interface MonthTilesProps {
  earnings: number;
  jobs: number;
}

/** The two grey stat tiles under the wallet card: this-month earnings and this-month jobs. */
export function MonthTiles({earnings, jobs}: MonthTilesProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-[8px] bg-grey-100 px-3 py-2">
        <p className="flex items-center gap-1 text-[12px] font-medium text-grey-600">
          <CalendarDays className="size-3.5" aria-hidden="true" />
          {m["earnings.month"]()}
        </p>
        <p className="mt-3 px-1 text-[20px] leading-[26px] font-medium">{`₦${earnings.toLocaleString("en-US")}`}</p>
      </div>
      <div className="rounded-[8px] bg-grey-100 px-3 py-2">
        <p className="flex items-center gap-1 text-[12px] font-medium text-grey-600">
          <Package className="size-3.5" aria-hidden="true" />
          {m["earnings.month_jobs"]()}
        </p>
        <p className="mt-3 px-1 text-[20px] leading-[26px] font-medium">{`${jobs} ${m["analytics.jobs"]()}`}</p>
      </div>
    </div>
  );
}
