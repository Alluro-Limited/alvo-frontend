const BONE = "animate-pulse rounded bg-grey-200";

/** List skeleton: metric cards, type cards, toolbar strip, then table rows — no spinners per repo convention. */
export function AssignmentSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true">
      <div className="grid grid-cols-6 gap-3">
        {Array.from({length: 6}, (_, i) => (
          <div key={i} className={`${BONE} h-[110px]`} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {Array.from({length: 3}, (_, i) => (
          <div key={i} className={`${BONE} h-[68px]`} />
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
