/** Page-level loading skeleton — KPI cards, the two issue cards, then table rows. */
export function PayoutsSkeleton() {
  return (
    <div className="flex flex-col gap-6" data-testid="payouts-skeleton">
      <div className="flex gap-2 rounded-[10px] bg-grey-100 p-2">
        {Array.from({length: 4}, (_, index) => (
          <div key={index} className="h-[114px] flex-1 rounded-xl bg-white/70" />
        ))}
      </div>
      <div className="flex gap-6">
        {Array.from({length: 2}, (_, index) => (
          <div key={index} className="h-[329px] flex-1 rounded-xl border border-grey-300 bg-white/60" />
        ))}
      </div>
      <div className="h-14 rounded-xl bg-white/60" />
      <div className="flex flex-col rounded-xl bg-white/60">
        {Array.from({length: 8}, (_, index) => (
          <div key={index} className="h-14 border-b border-grey-200 last:border-0" />
        ))}
      </div>
    </div>
  );
}
