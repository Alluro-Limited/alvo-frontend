import {useNavigate} from "@tanstack/react-router";
import {JobChart} from "@/components/analytics/job-chart";
import {StatCard} from "@/components/analytics/stat-card";
import {WizardHeader} from "@/components/sign-up/wizard-header";
import {useAnalyticsQuery} from "@/queries/use-deliveries-queries";
import {m} from "@/paraglide/messages";

/** The View Analytics target: 2×2 stat tiles plus the weekly Job Chart. */
export function AnalyticsPage() {
  const navigate = useNavigate();
  const query = useAnalyticsQuery();

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[430px] bg-white px-6 pt-[max(24px,env(safe-area-inset-top))] pb-[max(24px,env(safe-area-inset-bottom))]">
      <WizardHeader step={0} onBack={() => void navigate({to: "/deliveries"})} />
      <h1 className="mt-9 text-[28px] leading-[34px] font-bold tracking-[-0.02em]">{m["analytics.title"]()}</h1>
      {query.isPending || !query.data ? (
        <div className="mt-6 grid grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-[76px] animate-pulse rounded-[12px] bg-grey-100" />
          ))}
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <StatCard label={m["analytics.all_time_jobs"]()} value={`${query.data.allTimeJobs} ${m["analytics.jobs"]()}`} />
            <StatCard label={m["analytics.today_jobs"]()} value={`${query.data.todayJobs} ${m["analytics.jobs"]()}`} />
            <StatCard label={m["analytics.all_time_earnings"]()} value={`₦${query.data.allTimeEarnings.toLocaleString("en-US")}`} />
            <StatCard label={m["analytics.today_earnings"]()} value={`₦${query.data.todayEarnings.toLocaleString("en-US")}`} />
          </div>
          <JobChart values={query.data.weeklyJobs} />
        </>
      )}
    </main>
  );
}
