/** Placeholder cards while the drawer payload loads. */
export function DrawerSkeleton() {
  return (
    <div className="animate-pulse space-y-3 p-4" aria-busy="true">
      <div className="h-16 rounded-lg bg-grey-200" />
      <div className="h-64 rounded-lg bg-white" />
      <div className="h-64 rounded-lg bg-white" />
    </div>
  );
}
