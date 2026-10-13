import {SendHorizontal} from "lucide-react";
import type {CourierJob} from "@/types/home-types";
import {m} from "@/paraglide/messages";
import {JobCardActions} from "./job-card-actions";
import {JobProgress} from "./job-progress";
import {StageChip} from "./stage-chip";

interface JobCardProps {
  job: CourierJob;
  pending: boolean;
  onDecline: () => void;
  onAccept: () => void;
}

/** The white inner card inside a delivery section: id + stage chip, route, payout, progress, times, actions. */
export function JobCard({job, pending, onDecline, onAccept}: JobCardProps) {
  return (
    <article className="rounded-[10px] border border-grey-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-grey-500">{job.id}</p>
        <StageChip stage={job.stage} />
      </div>
      <div className="mt-3 flex items-end justify-between">
        <p className="flex items-center gap-1.5 text-[16px] font-bold tracking-[-0.01em]">
          {job.origin}
          <SendHorizontal className="size-4 text-primary-500" aria-hidden="true" />
          {job.destination}
        </p>
        <p className="text-[16px] font-bold">
          ₦{job.payout.toLocaleString("en-US")}
          <span className="ml-1 text-[12px] font-medium text-grey-500">({job.packages}pkg)</span>
        </p>
      </div>
      <div className="mt-2.5">
        <JobProgress stage={job.stage} />
      </div>
      <div className="mt-2 flex items-start justify-between">
        <div>
          <p className="text-[26px] leading-[30px] font-bold tracking-[-0.01em]">{job.pickupTime}</p>
          <p className="text-[11px] font-medium tracking-wide text-grey-500 uppercase">{m["home.pickup"]()}</p>
        </div>
        <div className="pt-1.5 text-center">
          <p className="text-[12px] font-bold text-danger-500">{job.duration}</p>
          <p className="text-[11px] text-grey-500">{`${job.distanceKm}km`}</p>
        </div>
        <div className="text-right">
          <p className="text-[26px] leading-[30px] font-bold tracking-[-0.01em]">{job.eta}</p>
          <p className="text-[11px] font-medium tracking-wide text-grey-500 uppercase">{m["home.eta"]()}</p>
        </div>
      </div>
      <JobCardActions jobId={job.id} assignment={job.stage === "assignment"} pending={pending} onDecline={onDecline} onAccept={onAccept} />
    </article>
  );
}
