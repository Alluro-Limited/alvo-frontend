import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {workloadsService} from "@/services/workloads-service";
import type {WorkloadListParams} from "@/types/workloads-types";

export const batchParcelsQueryKey = (batchId: string, params: WorkloadListParams) =>
  ["workloads", "batch", batchId, "parcels", params] as const;

/** Paginated parcel list inside a batch. Previous page data stays while the next loads. */
export function useBatchParcelsQuery(batchId: string, params: WorkloadListParams) {
  return useQuery({
    queryKey: batchParcelsQueryKey(batchId, params),
    queryFn: () => workloadsService.getBatchParcels(batchId, params),
    retry: false,
    placeholderData: keepPreviousData,
  });
}
