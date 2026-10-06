const BONE = "animate-pulse rounded bg-grey-200";

/** Detail skeleton: summary card, stat row, then the two-column body — no spinners per repo convention. */
export function NodeDetailSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true">
      <div className={`${BONE} h-[120px] w-full rounded-lg`} />
      <div className="flex gap-2">
        {Array.from({length: 4}, (_, i) => (
          <div key={i} className={`${BONE} h-[104px] flex-1 rounded-lg`} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <div className={`${BONE} h-[240px] rounded-lg`} />
          <div className={`${BONE} h-[200px] rounded-lg`} />
        </div>
        <div className="flex flex-col gap-4">
          <div className={`${BONE} h-[260px] rounded-lg`} />
          <div className={`${BONE} h-[200px] rounded-lg`} />
        </div>
      </div>
    </div>
  );
}
