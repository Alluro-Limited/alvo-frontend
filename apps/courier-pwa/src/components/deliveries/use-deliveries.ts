import {useState} from "react";
import {useAcceptActiveMutation, useDeclineActiveMutation, useDeliveriesQuery} from "@/queries/use-deliveries-queries";
import type {JobKind} from "@/types/home-types";

/** Deliveries-tab state: overview + kind filter + the same accept-confirm gate as home. */
export function useDeliveries() {
  const query = useDeliveriesQuery();
  const accept = useAcceptActiveMutation();
  const decline = useDeclineActiveMutation();
  const [filter, setFilter] = useState<"all" | JobKind>("all");
  const [confirming, setConfirming] = useState<string | null>(null);

  const completed = (query.data?.completed ?? []).filter((d) => filter === "all" || d.kind === filter);

  const confirmAccept = () => {
    if (confirming) accept.mutate(confirming, {onSuccess: () => setConfirming(null)});
  };

  return {
    active: query.data?.active ?? null,
    completed,
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
