/** The three-dot in-sheet loading state used while a mutation is in flight. */
export function LoadingDots() {
  return (
    <div className="flex h-64 w-full items-center justify-center gap-2" aria-busy="true" role="status">
      {[0, 1, 2].map((i) => (
        <span key={i} className="size-2.5 animate-pulse rounded-full bg-grey-400" />
      ))}
    </div>
  );
}
