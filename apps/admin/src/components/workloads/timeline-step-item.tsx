import timelineCheck from "@/assets/timeline-check.svg";
import timelinePending from "@/assets/timeline-pending.svg";

/** One vertical timeline row — check icon when done, grey box when pending, connector line between. */
export function TimelineStepItem({label, detail, done, last}: {label: string; detail: string; done: boolean; last: boolean}) {
  return (
    <li className="flex gap-3">
      <div className="flex flex-col items-center">
        <img src={done ? timelineCheck : timelinePending} alt="" className="size-4 shrink-0" aria-hidden="true" />
        {!last && <span className="w-0.5 flex-1 bg-grey-200" aria-hidden="true" />}
      </div>
      <div className="pb-4">
        <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{label}</p>
        <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{detail}</p>
      </div>
    </li>
  );
}
