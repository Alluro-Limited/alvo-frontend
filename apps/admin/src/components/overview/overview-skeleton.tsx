import {m} from "@/paraglide/messages";

function Block({className}: {className: string}) {
  return <div className={`animate-pulse rounded-xl bg-grey-200 ${className}`} aria-hidden="true" />;
}

/** Skeleton matching the overview layout: KPI strip, then the map panel + right rail. */
export function OverviewSkeleton() {
  return (
    <div className="flex flex-col gap-4" role="status" aria-busy="true" aria-label={m["overview.loading"]()}>
      <div className="flex gap-2">
        <Block className="h-[120px] flex-1" />
        <Block className="h-[120px] flex-1" />
        <Block className="h-[120px] flex-1" />
        <Block className="h-[120px] flex-1" />
      </div>
      <div className="flex gap-4">
        <Block className="h-[769px] flex-1" />
        <div className="flex w-[367px] shrink-0 flex-col gap-4">
          <Block className="h-[197px]" />
          <Block className="h-[270px]" />
          <Block className="h-[270px]" />
        </div>
      </div>
      <span className="sr-only">{m["overview.loading"]()}</span>
    </div>
  );
}
