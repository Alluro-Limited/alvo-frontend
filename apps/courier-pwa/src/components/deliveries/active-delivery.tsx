import {Truck} from "lucide-react";
import {JobCard} from "@/components/home/job-card";
import type {CourierJob} from "@/types/home-types";
import {m} from "@/paraglide/messages";

interface ActiveDeliveryProps {
  job: CourierJob | null;
  pending: boolean;
  onDecline: (id: string) => void;
  onAccept: (id: string) => void;
}

/** The milestone slot on Deliveries — the live job card, or the "no delivery assigned" placeholder. */
export function ActiveDelivery({job, pending, onDecline, onAccept}: ActiveDeliveryProps) {
  if (!job) {
    return (
      <div className="flex flex-col items-center rounded-[14px] bg-grey-50 py-8">
        <span className="grid size-12 place-items-center rounded-full bg-grey-100">
          <Truck className="size-6 text-grey-400" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <p className="mt-3 text-[13px] font-medium text-grey-500">{m["deliveries.no_active"]()}</p>
      </div>
    );
  }

  return <JobCard job={job} pending={pending} onDecline={() => onDecline(job.id)} onAccept={() => onAccept(job.id)} />;
}
