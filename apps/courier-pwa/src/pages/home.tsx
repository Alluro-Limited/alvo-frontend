import {AcceptDialog} from "@/components/home/accept-dialog";
import {AreaToast} from "@/components/home/area-toast";
import {DeliverySection} from "@/components/home/delivery-section";
import {ExploreJobsCard} from "@/components/home/explore-jobs-card";
import {HomeHeader} from "@/components/home/home-header";
import {HomeSkeleton} from "@/components/home/home-skeleton";
import {useHome} from "@/components/home/use-home";

export function HomePage() {
  const home = useHome();
  const data = home.query.data;
  const job = (kind: "regular" | "speed") => data?.jobs.find((j) => j.kind === kind) ?? null;

  return (
    <main className="min-h-dvh bg-white pb-[104px]">
      {data ? (
        <>
          <HomeHeader
            firstName={data.firstName}
            area={data.area}
            live={data.isLive}
            unread={data.unreadNotifications}
            pending={home.mutating}
            onToggle={home.toggle}
          />
          <div className="flex flex-col gap-5 px-6 pt-5">
            <ExploreJobsCard />
            <DeliverySection
              kind="regular"
              job={job("regular")}
              offline={!data.isLive}
              pending={home.mutating}
              onDecline={home.decline}
              onAccept={home.askAccept}
            />
            <DeliverySection
              kind="speed"
              job={job("speed")}
              offline={!data.isLive}
              pending={home.mutating}
              onDecline={home.decline}
              onAccept={home.askAccept}
            />
          </div>
        </>
      ) : (
        <HomeSkeleton />
      )}
      <AcceptDialog open={home.confirming !== null} pending={home.mutating} onConfirm={home.confirmAccept} onClose={home.closeConfirm} />
      <AreaToast />
    </main>
  );
}
