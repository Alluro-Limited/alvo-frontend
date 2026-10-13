/** Placeholder blocks while the home query loads — mirrors the header + two section cards. */
export function HomeSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <div className="bg-primary-500 px-6 pt-[calc(env(safe-area-inset-top)+24px)] pb-6">
        <div className="h-5 w-32 rounded bg-white/30" />
        <div className="mt-2 h-5 w-40 rounded bg-white/30" />
        <div className="mt-5 h-12 rounded-[10px] bg-black/20" />
      </div>
      <div className="flex flex-col gap-5 px-6 pt-5">
        <div className="h-16 rounded-[12px] bg-grey-100" />
        <div className="h-44 rounded-[14px] bg-grey-100" />
        <div className="h-32 rounded-[14px] bg-grey-100" />
      </div>
    </div>
  );
}
