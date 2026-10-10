import {useState} from "react";
import {ActivityCard} from "@/components/overview/activity-card";
import {AlertsCard} from "@/components/overview/alerts-card";
import {DeliveryRateCard} from "@/components/overview/delivery-rate-card";
import {KpiCards} from "@/components/overview/kpi-cards";
import {LiveMap} from "@/components/overview/live-map";
import {OverviewError} from "@/components/overview/overview-error";
import {OverviewSkeleton} from "@/components/overview/overview-skeleton";
import {WelcomeModal} from "@/components/overview/welcome-modal";
import {useOverviewQuery} from "@/queries/use-overview-query";

/** Dashboard home: KPI strip, live map, and the rate/alerts/activity rail, all behind the welcome modal on first run. */
export function OverviewPage() {
  const {data, isPending, isError, refetch, isRefetching} = useOverviewQuery();
  // "Start tour" hides the modal for now — the guided tour itself is deferred until the admin is complete.
  const [tourDismissed, setTourDismissed] = useState(false);

  if (isPending) return <OverviewSkeleton />;
  if (isError || !data) return <OverviewError onRetry={() => void refetch()} isRetrying={isRefetching} />;

  return (
    <>
      <div className="flex flex-col gap-4">
        <KpiCards kpis={data.kpis} />
        <div className="flex items-stretch gap-4">
          <LiveMap data={data.map} className="min-w-0 flex-1" />
          <div className="flex w-[367px] shrink-0 flex-col gap-4">
            <DeliveryRateCard rate={data.deliveryRate} />
            <AlertsCard alerts={data.alerts} />
            <ActivityCard items={data.activity} />
          </div>
        </div>
      </div>
      {data.firstRun && !tourDismissed && <WelcomeModal onStartTour={() => setTourDismissed(true)} />}
    </>
  );
}
