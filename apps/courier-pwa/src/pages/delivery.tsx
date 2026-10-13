import {useNavigate} from "@tanstack/react-router";
import {CompleteSheet} from "@/components/delivery/complete-sheet";
import {DeliveryHeader} from "@/components/delivery/delivery-header";
import {DeliverySkeleton} from "@/components/delivery/delivery-skeleton";
import {OverviewTab} from "@/components/delivery/overview-tab";
import {PackagesTab} from "@/components/delivery/packages-tab";
import {StatusTab} from "@/components/delivery/status-tab";
import {useDelivery} from "@/components/delivery/use-delivery";

/**
 * The job-flow screen behind View Details / an accepted marketplace offer.
 * Overview (locker code + route), Packages (scan/manifest), Status (radio + timeline).
 */
export function DeliveryPage({jobId}: {jobId: string}) {
  const navigate = useNavigate();
  const job = useDelivery(jobId);

  if (job.loading || !job.delivery) return <DeliverySkeleton />;

  const d = job.delivery;
  return (
    <main className="mx-auto min-h-dvh w-full max-w-[430px] bg-white px-6 pt-[max(24px,env(safe-area-inset-top))] pb-[max(24px,env(safe-area-inset-bottom))]">
      <DeliveryHeader delivery={d} tab={job.tab} onTab={job.setTab} onBack={() => void navigate({to: "/home"})} />
      {job.tab === "overview" && <OverviewTab delivery={d} />}
      {job.tab === "packages" && (
        <PackagesTab
          delivery={d}
          lastScanned={job.scan.lastScanned}
          notice={job.scan.notice}
          scanning={job.scan.scanning}
          onScanNext={job.scan.scanNextPackage}
          onScanCode={job.scan.scanManual}
        />
      )}
      {job.tab === "status" && (
        <StatusTab delivery={d} selected={job.selected} pending={job.confirming} onSelect={job.setSelected} onConfirm={job.confirmStatus} />
      )}
      <CompleteSheet jobId={d.id} payout={d.payout} open={job.sheetOpen} onClose={job.closeSheet} />
    </main>
  );
}
