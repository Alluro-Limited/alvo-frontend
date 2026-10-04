import {m} from "@/paraglide/messages";

function Bar({className}: {className: string}) {
  return <div className={`animate-pulse rounded-lg bg-grey-200 ${className}`} aria-hidden="true" />;
}

/** Skeleton that mirrors the setup form's shape while the invitation details load (skeletons, never spinners). */
export function AccountSetupSkeleton() {
  return (
    <div className="flex w-full flex-col gap-8" role="status" aria-busy="true" aria-label={m["account_setup.loading"]()}>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-4">
          <div className="flex flex-col gap-2">
            <Bar className="h-5 w-24" />
            <Bar className="h-[50px] w-full" />
          </div>
          <div className="flex flex-col gap-2">
            <Bar className="h-5 w-24" />
            <Bar className="h-[50px] w-full" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Bar className="h-5 w-20" />
          <Bar className="h-[50px] w-full" />
        </div>
        <div className="flex flex-col gap-2">
          <Bar className="h-5 w-28" />
          <Bar className="h-[50px] w-full" />
          <Bar className="h-4 w-52" />
        </div>
      </div>
      <Bar className="h-[50px] w-full" />
      <span className="sr-only">{m["account_setup.loading"]()}</span>
    </div>
  );
}
