import {Button} from "@alvo/ui";
import {Link} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import {useDashboardOverview} from "@/queries/use-dashboard-queries";
import {DashboardBanner} from "@/components/dashboard/dashboard-banner";
import {RecentShipments} from "@/components/dashboard/recent-shipments";
import {StatsGrid} from "@/components/dashboard/stats-grid";
import navAddWhiteUrl from "@/assets/nav-add-white.svg";

function StatsSkeleton() {
  return (
    <div className="grid w-full grid-cols-2 gap-4 xl:grid-cols-4" aria-hidden="true">
      {Array.from({length: 8}, (_, index) => (
        <div key={index} className="h-[147px] animate-pulse rounded-xl border border-grey-200 bg-white" />
      ))}
    </div>
  );
}

export function DashboardPage() {
  const {data: overview, isLoading} = useDashboardOverview();

  return (
    <section className="mx-auto flex w-full max-w-[1100px] flex-col items-start gap-8">
      <div className="flex w-full items-center justify-between">
        <div className="flex w-[342px] flex-col items-center justify-center gap-0.5 text-black">
          <h1 className="w-full text-xl leading-[1.2] font-medium">{m["dashboard.greeting"]({name: overview?.firstName ?? ""})}</h1>
          <p className="w-full text-sm leading-[1.4] tracking-[0.14px] opacity-70">{m["dashboard.greeting_sub"]()}</p>
        </div>
        <div className="flex items-center justify-end">
          <Button
            render={<Link to="/new-shipment" />}
            nativeButton={false}
            className="h-[38px] gap-2 px-3 py-2 text-base tracking-[0.32px]"
            startIcon={<img src={navAddWhiteUrl} alt="" aria-hidden="true" className="size-[22px]" />}
          >
            {m["dashboard.new_batch"]()}
          </Button>
        </div>
      </div>
      <DashboardBanner />
      {isLoading || !overview ? <StatsSkeleton /> : <StatsGrid stats={overview.stats} />}
      <RecentShipments shipments={overview?.recentShipments ?? []} />
    </section>
  );
}
