/** Loading placeholder for the marketplace list — no spinners per convention. */
export function JobsSkeleton() {
  return (
    <div className="mt-6 flex flex-col gap-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-[168px] animate-pulse rounded-[14px] bg-grey-100" />
      ))}
    </div>
  );
}
