import {cn} from "cnfast";
import bannerArtUrl from "@/assets/banner-map.svg";
import {m} from "@/paraglide/messages";

/** Teal "Send Securely" promo card with the map artwork and carousel dots below it. */
export function PromoBanner() {
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="relative h-[94px] w-full overflow-clip rounded-[8px] bg-primary-500">
        <img src={bannerArtUrl} alt="" aria-hidden="true" className="absolute top-1/2 right-[13px] size-20 -translate-y-1/2" />
        <div className="absolute top-1/2 left-5 flex w-[191px] -translate-y-1/2 flex-col gap-1">
          <p className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-white">{m["home.banner_title"]()}</p>
          <p className="text-[12px] leading-[1.4] tracking-[0.12px] text-[#f9f9f9]">{m["home.banner_desc"]()}</p>
        </div>
      </div>
      <div className="flex items-center gap-1" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span key={i} className={cn("h-2 w-2 rounded-full", i === 0 ? "bg-primary-500" : "bg-grey-300")} />
        ))}
      </div>
    </div>
  );
}
