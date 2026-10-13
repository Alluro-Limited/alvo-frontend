import {useState} from "react";
import {useAcceptJobMutation, useCourierHomeQuery, useDeclineJobMutation, useSetAvailabilityMutation} from "@/queries/use-home-queries";
import type {CourierJob} from "@/types/home-types";

/** Home tab state: the query, the live toggle, and the accept-confirmation flow. */
export function useHome() {
  const query = useCourierHomeQuery();
  const availability = useSetAvailabilityMutation();
  const accept = useAcceptJobMutation();
  const decline = useDeclineJobMutation();
  const [confirming, setConfirming] = useState<CourierJob | null>(null);

  const confirmAccept = () =>
    accept.mutate(confirming?.id ?? "", {
      onSettled: () => setConfirming(null),
    });

  return {
    query,
    confirming,
    mutating: availability.isPending || accept.isPending || decline.isPending,
    toggle: (live: boolean) => availability.mutate(live),
    askAccept: setConfirming,
    decline: (job: CourierJob) => decline.mutate(job.id),
    confirmAccept,
    closeConfirm: () => setConfirming(null),
  };
}
