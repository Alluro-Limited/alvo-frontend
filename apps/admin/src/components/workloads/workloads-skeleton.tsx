const BONE = "animate-pulse rounded bg-grey-200";

/** Page skeleton: metric cards, toolbar strip, then table rows — no spinners per repo convention. */
export function WorkloadsSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true">
      <div className="flex items-center justify-between">
        <div className={`${BONE} h-10 w-[348px]`} />
        <div className={`${BONE} h-9 w-[202px]`} />
      </div>
      <div className="flex gap-2">
        {Array.from({length: 5}, (_, i) => (
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
