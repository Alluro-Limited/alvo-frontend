const BONE = "animate-pulse rounded bg-grey-200";

/** Batch detail skeleton: header card, metric cards, toolbar strip, then table rows. */
export function BatchDetailSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true">
      <div className={`${BONE} h-9 w-[140px]`} />
      <div className={`${BONE} h-[140px] w-full rounded-lg`} />
      <div className="flex gap-2">
        {Array.from({length: 7}, (_, i) => (
          <div key={i} className={`${BONE} h-[129px] flex-1`} />
        ))}
      </div>
      <div className={`${BONE} h-16 w-full rounded-xl`} />
      <div className="flex flex-col overflow-clip rounded-lg border border-grey-200 bg-white">
        <div className={`${BONE} h-14 w-full rounded-none`} />
        {Array.from({length: 8}, (_, i) => (
          <div key={i} className="h-14 border-t border-grey-200" />
        ))}
      </div>
    </div>
  );
}
