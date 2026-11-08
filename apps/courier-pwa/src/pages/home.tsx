import {AcceptDialog} from "@/components/home/accept-dialog";
import {AppToast} from "@/components/app-toast";
import {AreaToast} from "@/components/home/area-toast";
import {DeliverySection} from "@/components/home/delivery-section";
import {ExploreJobsCard} from "@/components/home/explore-jobs-card";
import {HomeHeader} from "@/components/home/home-header";
import {HomeSkeleton} from "@/components/home/home-skeleton";
import {PageError} from "@/components/page-error";
import {useHome} from "@/components/home/use-home";
import type {CourierJob} from "@/types/home-types";
import {m} from "@/paraglide/messages";

const TOAST_MESSAGES = {
  availability: m["home.availability_failed"],
  accept: m["job.accept_failed"],
  decline: m["job.decline_failed"],
} as const;

export function HomePage() {
  const home = useHome();
  const data = home.query.data;

  return (
    <main className="min-h-dvh bg-white pb-[104px]">
      {data ? (
        <HomeBody data={data} mutating={home.mutating} onToggle={home.toggle} onDecline={home.decline} onAccept={home.askAccept} />
      ) : home.query.isError ? (
        <PageError onRetry={() => void home.query.refetch()} isRetrying={home.query.isRefetching} />
      ) : (
        <HomeSkeleton />
      )}
      <AcceptDialog open={home.confirming !== null} pending={home.mutating} onConfirm={home.confirmAccept} onClose={home.closeConfirm} />
      <AreaToast />
      {home.toast && (
        <AppToast
          message={TOAST_MESSAGES[home.toast as keyof typeof TOAST_MESSAGES]()}
          variant="destructive"
          onDismiss={home.dismissToast}
        />
      )}
    </main>
  );
}

interface HomeBodyProps {
  data: NonNullable<ReturnType<typeof useHome>["query"]["data"]>;
  mutating: boolean;
  onToggle: (live: boolean) => void;
  onDecline: (job: CourierJob) => void;
  onAccept: (job: CourierJob) => void;
}

function HomeBody({data, mutating, onToggle, onDecline, onAccept}: HomeBodyProps) {
  const job = (kind: "regular" | "speed") => data.jobs.find((j) => j.kind === kind) ?? null;
  return (
    <>
      <HomeHeader
        firstName={data.firstName}
        area={data.area}
        live={data.isLive}
        unread={data.unreadNotifications}
        pending={mutating}
        onToggle={onToggle}
      />
      <div className="flex flex-col gap-5 px-6 pt-5">
        <ExploreJobsCard />
        <DeliverySection
          kind="regular"
          job={job("regular")}
          offline={!data.isLive}
          pending={mutating}
          onDecline={onDecline}
          onAccept={onAccept}
        />
        <DeliverySection
          kind="speed"
          job={job("speed")}
          offline={!data.isLive}
          pending={mutating}
          onDecline={onDecline}
          onAccept={onAccept}
        />
      </div>
    </>
  );
}
