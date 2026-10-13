import {useNavigate} from "@tanstack/react-router";
import {AcceptDialog} from "@/components/home/accept-dialog";
import {JobOfferCard} from "@/components/jobs/job-offer-card";
import {JobsEmpty} from "@/components/jobs/jobs-empty";
import {JobsFilter} from "@/components/jobs/jobs-filter";
import {JobsSkeleton} from "@/components/jobs/jobs-skeleton";
import {useJobs} from "@/components/jobs/use-jobs";
import {WizardHeader} from "@/components/sign-up/wizard-header";
import {m} from "@/paraglide/messages";

/**
 * The jobs marketplace — deliveries outside the courier's assigned zone
 * (the "Explore Jobs" target on Home). Accepting goes through the same
 * responsibility-confirm dialog as assigned deliveries, then into the job flow.
 */
export function JobsPage() {
  const jobs = useJobs();
  const navigate = useNavigate();

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-white px-6 pt-[max(24px,env(safe-area-inset-top))] pb-[max(24px,env(safe-area-inset-bottom))]">
      <WizardHeader step={0} onBack={() => void navigate({to: "/home"})} />
      <h1 className="mt-9 text-[28px] leading-[34px] font-bold tracking-[-0.02em]">{m["jobs.title"]()}</h1>
      <p className="mt-2 text-[14px] leading-[22px] text-grey-600">{m["jobs.subtitle"]()}</p>
      <JobsFilter value={jobs.filter} onChange={jobs.setFilter} />
      {jobs.loading ? (
        <JobsSkeleton />
      ) : jobs.offers.length === 0 ? (
        <JobsEmpty />
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {jobs.offers.map((offer) => (
            <JobOfferCard
              key={offer.id}
              offer={offer}
              pending={jobs.mutating}
              onDecline={() => jobs.declineJob(offer.id)}
              onAccept={() => jobs.askAccept(offer.id)}
            />
          ))}
        </div>
      )}
      <AcceptDialog open={jobs.confirming !== null} pending={jobs.mutating} onConfirm={jobs.confirmAccept} onClose={jobs.closeConfirm} />
    </main>
  );
}
