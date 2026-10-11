import successCheckUrl from "@/assets/success-check.svg";
import {m} from "@/paraglide/messages";

/** The all-delivered celebration card shown above the batch summary. */
export function DeliveredBanner() {
  return (
    <section className="flex w-full flex-col items-center gap-4 rounded-lg border-[0.75px] border-grey-200 bg-white px-4 py-6">
      <img src={successCheckUrl} alt="" aria-hidden="true" className="size-16" />
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl leading-[1.2] font-medium tracking-[-0.24px] text-black">{m["batches.done_title"]()}</h2>
        <p className="text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{m["batches.done_sub"]()}</p>
      </div>
    </section>
  );
}
