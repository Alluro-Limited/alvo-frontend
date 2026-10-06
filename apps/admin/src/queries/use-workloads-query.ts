import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {workloadsService} from "@/services/workloads-service";
import type {WorkloadListParams} from "@/types/workloads-types";

export const workloadsQueryKey = (params: WorkloadListParams) => ["workloads", params] as const;

/** Metrics + the filtered, paginated parcel list. Previous page data stays while the next loads. */
export function useWorkloadsQuery(params: WorkloadListParams) {
  return useQuery({
    queryKey: workloadsQueryKey(params),
    queryFn: () => workloadsService.getWorkloads(params),
    retry: false,
    placeholderData: keepPreviousData,
  });
}
