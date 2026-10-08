/** Loading placeholder for the admins console — metrics cards + table rows. */
export function AdminsSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true">
      <div className="grid grid-cols-4 gap-4">
        {Array.from({length: 4}, (_, index) => (
          <div key={index} className="h-[104px] animate-pulse rounded-2xl border border-grey-200 bg-grey-100" />
        ))}
      </div>
      <div className="flex gap-3">
        <div className="h-11 w-[400px] animate-pulse rounded-lg bg-grey-100" />
        <div className="h-11 w-[160px] animate-pulse rounded-lg bg-grey-100" />
        <div className="h-11 w-[190px] animate-pulse rounded-lg bg-grey-100" />
      </div>
      <div className="h-[420px] animate-pulse rounded-2xl border border-grey-200 bg-grey-100" />
    </div>
  );
}
