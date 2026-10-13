import {useState} from "react";
import {useNavigate} from "@tanstack/react-router";
import {useAcceptJobOfferMutation, useDeclineJobOfferMutation, useJobsQuery} from "@/queries/use-jobs-queries";
import type {JobsFilterValue} from "./jobs-filter";

/** Marketplace state: offers + filter + the accept-confirm gate shared with the home assignment flow. */
export function useJobs() {
  const query = useJobsQuery();
  const accept = useAcceptJobOfferMutation();
  const decline = useDeclineJobOfferMutation();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<JobsFilterValue>("all");
  const [confirming, setConfirming] = useState<string | null>(null);

  const offers = (query.data ?? []).filter((o) => filter === "all" || o.kind === filter);

  const confirmAccept = () => {
    if (!confirming) return;
    accept.mutate(confirming, {
      onSuccess: () => {
        const jobId = confirming;
        setConfirming(null);
        void navigate({to: "/deliveries/$jobId", params: {jobId}});
      },
    });
  };

  return {
    offers,
    filter,
    setFilter,
    loading: query.isPending,
    confirming,
    mutating: accept.isPending,
    askAccept: setConfirming,
    confirmAccept,
    closeConfirm: () => setConfirming(null),
    declineJob: (id: string) => decline.mutate(id),
  };
}
