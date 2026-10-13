import {m} from "@/paraglide/messages";
import {cn} from "cnfast";

const DAYS = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"] as const;
const BAR_HEIGHT = 60;

/** The "Job Chart" card — seven rounded teal bars over the weekday labels, best day emphasized. */
export function JobChart({values}: {values: number[]}) {
  const max = Math.max(...values, 1);

  return (
    <section className="mt-6">
      <h2 className="text-[14px] font-semibold text-grey-500">{m["analytics.job_chart"]()}</h2>
      <div className="mt-3 rounded-[14px] bg-grey-50 px-4 pt-5 pb-3">
        <div className="flex items-end justify-between gap-2" style={{height: BAR_HEIGHT}}>
          {values.slice(0, 7).map((v, i) => (
            <div key={DAYS[i]} className="w-8 rounded-[6px] bg-primary-500" style={{height: `${Math.max(18, (v / max) * BAR_HEIGHT)}px`}} />
          ))}
        </div>
        <div className="mt-2 flex justify-between">
          {DAYS.map((day, i) => (
            <p key={day} className={cn("w-8 text-center text-[11px]", i === 5 ? "font-bold text-foreground" : "text-grey-500")}>
              {day}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
