import {m} from "@/paraglide/messages";
import tourCloseUrl from "@/assets/tour-close.svg";
import tourPointerDownUrl from "@/assets/tour-pointer-down.svg";
import tourPointerLeftUrl from "@/assets/tour-pointer-left.svg";

interface TourTooltipProps {
  ref: React.Ref<HTMLDivElement>;
  style: React.CSSProperties;
  /** `top` points down at content below the card; `left` points at a sidebar item. */
  side: "top" | "left";
  title: string;
  body: string;
  onSkip: () => void;
  onNext: () => void;
}

function Card({title, body, onSkip, onNext}: Omit<TourTooltipProps, "ref" | "style" | "side">) {
  return (
    <div className="flex w-[330px] flex-col gap-4 rounded-lg border border-grey-100 bg-white p-4">
      <div className="flex w-full items-start justify-center gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-1 text-sm leading-[1.4] tracking-[0.14px]">
          <p className="font-bold text-primary-800">{title}</p>
          <p className="text-grey-600">{body}</p>
        </div>
        <button type="button" onClick={onSkip} aria-label={m["tour.skip"]()} className="flex h-full items-start">
          <img src={tourCloseUrl} alt="" aria-hidden="true" className="size-5" />
        </button>
      </div>
      <div className="flex w-full items-center justify-between">
        <button type="button" onClick={onSkip} className="text-sm leading-[1.4] font-bold tracking-[0.14px] text-grey-600">
          {m["tour.skip"]()}
        </button>
        <button type="button" onClick={onNext} className="text-sm leading-[1.4] font-bold tracking-[0.14px] text-primary-500">
          {m["tour.next"]()}
        </button>
      </div>
    </div>
  );
}

/** A single tour popover: white card with title/body, Skip/Next actions, and the pointer triangle. */
export function TourTooltip({ref, style, side, ...card}: TourTooltipProps) {
  if (side === "left") {
    return (
      <div ref={ref} style={style} className="fixed isolate flex items-start">
        <div className="z-[2] mr-[-2px] flex items-center self-stretch py-4">
          <img src={tourPointerLeftUrl} alt="" aria-hidden="true" className="h-5 w-3" />
        </div>
        <div className="z-[1]">
          <Card {...card} />
        </div>
      </div>
    );
  }
  return (
    <div ref={ref} style={style} className="fixed isolate flex flex-col">
      <div className="z-[2] mb-[-2px]">
        <Card {...card} />
      </div>
      <div className="z-[1] flex items-center justify-center px-4">
        <img src={tourPointerDownUrl} alt="" aria-hidden="true" className="h-3 w-5" />
      </div>
    </div>
  );
}
