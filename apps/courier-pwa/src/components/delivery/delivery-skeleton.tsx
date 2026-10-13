/** Loading placeholder for the delivery detail — no spinners per convention. */
export function DeliverySkeleton() {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-[430px] bg-white px-6 pt-[max(24px,env(safe-area-inset-top))]">
      <div className="h-8 w-8 animate-pulse rounded bg-grey-100" />
      <div className="mt-6 h-7 w-48 animate-pulse rounded bg-grey-100" />
      <div className="mt-2 h-4 w-40 animate-pulse rounded bg-grey-100" />
      <div className="mt-6 h-10 animate-pulse rounded bg-grey-100" />
      <div className="mt-5 h-40 animate-pulse rounded-[14px] bg-grey-100" />
    </main>
  );
}
