import {m} from "@/paraglide/messages";
import bannerUrl from "@/assets/banner.png";

/** The ~98px promo strip between the greeting and the stats. Copy is a design placeholder. */
export function DashboardBanner() {
  return (
    <div className="relative h-[98px] w-full overflow-clip rounded-lg">
      <img src={bannerUrl} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 size-full object-cover" />
      <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[42px] leading-[1.1] font-bold tracking-[-0.42px] whitespace-nowrap text-white">
        {m["dashboard.banner"]()}
      </p>
    </div>
  );
}
