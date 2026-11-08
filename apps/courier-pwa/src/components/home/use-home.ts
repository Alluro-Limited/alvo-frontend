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
  const [toast, setToast] = useState<string | null>(null);

  const confirmAccept = () =>
    accept.mutate(confirming?.id ?? "", {
      onSuccess: () => setConfirming(null),
      onError: () => {
        setConfirming(null);
        setToast("accept");
      },
    });

  return {
    query,
    confirming,
    mutating: availability.isPending || accept.isPending || decline.isPending,
    toggle: (live: boolean) => availability.mutate(live, {onError: () => setToast("availability")}),
    askAccept: setConfirming,
    decline: (job: CourierJob) => decline.mutate(job.id, {onError: () => setToast("decline")}),
    confirmAccept,
    closeConfirm: () => setConfirming(null),
    toast,
    dismissToast: () => setToast(null),
  };
}
