import {useQuery} from "@tanstack/react-query";
import {workloadsService} from "@/services/workloads-service";

export const batchDetailQueryKey = (id: string) => ["workloads", "batch", id] as const;

/** Batch header, progress, and metrics behind the batch detail page. */
export function useBatchDetailQuery(id: string) {
  return useQuery({
    queryKey: batchDetailQueryKey(id),
    queryFn: () => workloadsService.getBatchDetail(id),
    retry: false,
  });
}
