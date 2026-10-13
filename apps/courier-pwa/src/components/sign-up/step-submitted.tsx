import badgeUrl from "@/assets/submitted-badge.png";
import {m} from "@/paraglide/messages";

export function StepSubmitted() {
  return (
    <div className="flex flex-col items-center text-center">
      <img src={badgeUrl} alt="" aria-hidden="true" className="size-16" />
      <h1 className="mt-8 w-[321px] text-[28px] leading-[35px] font-bold tracking-[-0.01em]">{m["su.done_title"]()}</h1>
      <p className="mt-2 w-[321px] text-[15px] leading-[22px] text-grey-600">{m["su.done_desc"]()}</p>
    </div>
  );
}
