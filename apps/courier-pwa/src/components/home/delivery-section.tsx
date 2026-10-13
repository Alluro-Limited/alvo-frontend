import {cn} from "cnfast";
import type {CourierJob, JobKind} from "@/types/home-types";
import {m} from "@/paraglide/messages";
import {JobCard} from "./job-card";
import {JobEmpty} from "./job-empty";

interface DeliverySectionProps {
  kind: JobKind;
  job: CourierJob | null;
  offline: boolean;
  pending: boolean;
  onDecline: (job: CourierJob) => void;
  onAccept: (job: CourierJob) => void;
}

/** One "REGULAR/SPEED DELIVERY" band card with either the assigned job or the section's empty state. */
export function DeliverySection({kind, job, offline, pending, onDecline, onAccept}: DeliverySectionProps) {
  const speed = kind === "speed";

  return (
    <section className={cn("overflow-hidden rounded-[14px] border-2", speed ? "border-[#f2ae43]" : "border-primary-500")}>
      <h2
        className={cn(
          "px-4 py-2.5 text-[14px] font-bold tracking-[0.02em] text-white uppercase",
          speed ? "bg-[#f2ae43]" : "bg-primary-500"
        )}
      >
        {speed ? m["home.speed"]() : m["home.regular"]()}
      </h2>
      <div className="bg-white p-3">
        {job ? (
          <JobCard job={job} pending={pending} onDecline={() => onDecline(job)} onAccept={() => onAccept(job)} />
        ) : (
          <JobEmpty offline={offline} kind={kind} />
        )}
      </div>
    </section>
  );
}
