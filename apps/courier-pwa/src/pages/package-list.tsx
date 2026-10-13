import {useNavigate} from "@tanstack/react-router";
import {PackageRow} from "@/components/delivery/package-row";
import {WizardHeader} from "@/components/sign-up/wizard-header";
import {useDeliveryQuery} from "@/queries/use-delivery-queries";
import {m} from "@/paraglide/messages";

/** The full manifest behind "See all" — every package with its scan status. */
export function PackageListPage({jobId}: {jobId: string}) {
  const navigate = useNavigate();
  const query = useDeliveryQuery(jobId);

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[430px] bg-white px-6 pt-[max(24px,env(safe-area-inset-top))] pb-[max(24px,env(safe-area-inset-bottom))]">
      <WizardHeader step={0} onBack={() => void navigate({to: "/deliveries/$jobId", params: {jobId}})} />
      <h1 className="mt-6 text-[24px] leading-[30px] font-bold tracking-[-0.01em]">{m["job.package_list"]()}</h1>
      {query.isPending || !query.data ? (
        <div className="mt-4 flex flex-col gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-[10px] bg-grey-100" />
          ))}
        </div>
      ) : (
        <ul className="mt-2">
          {query.data.packages.map((p) => (
            <PackageRow key={p.code} pkg={p} />
          ))}
        </ul>
      )}
    </main>
  );
}
