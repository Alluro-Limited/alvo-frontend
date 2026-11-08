import {useState} from "react";
import {useDeliveryQuery, useUpdateStatusMutation} from "@/queries/use-delivery-queries";
import type {DeliveryStatus} from "@/types/delivery-types";
import type {DeliveryTab} from "./delivery-header";
import {usePackageScan} from "./use-package-scan";

/** The delivery detail state: tab, package scanning, status radio, completion sheet. */
export function useDelivery(jobId: string) {
  const query = useDeliveryQuery(jobId);
  const updateStatus = useUpdateStatusMutation(jobId);
  const scan = usePackageScan(jobId);

  const [tab, setTab] = useState<DeliveryTab>("overview");
  const [selected, setSelected] = useState<DeliveryStatus>("assigned");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [statusFailed, setStatusFailed] = useState(false);

  const confirmStatus = () =>
    updateStatus.mutate(selected, {
      onSuccess: () => selected === "dropped_off" && setSheetOpen(true),
      onError: () => setStatusFailed(true),
    });

  return {
    delivery: query.data,
    loading: query.isPending,
    error: query.isError,
    retry: query.refetch,
    retrying: query.isRefetching,
    tab,
    setTab,
    scan,
    selected,
    setSelected,
    confirming: updateStatus.isPending,
    confirmStatus,
    statusFailed,
    dismissStatusError: () => setStatusFailed(false),
    sheetOpen,
    closeSheet: () => setSheetOpen(false),
  };
}
