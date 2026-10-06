/** Placeholder rows while a manual-assign step's options load. */
export function AssignStepSkeleton() {
  return (
    <div className="flex flex-col gap-2" aria-busy="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-16 animate-pulse rounded-lg bg-grey-100" />
      ))}
    </div>
  );
}
