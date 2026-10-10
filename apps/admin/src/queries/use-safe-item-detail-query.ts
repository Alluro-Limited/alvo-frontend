import {useQuery} from "@tanstack/react-query";
import {workloadsService} from "@/services/workloads-service";

export const safeItemDetailQueryKey = (id: string) => ["workloads", "safe", id] as const;

/** Detail payload behind the Safe item drawer. Skips fetching while the drawer is closed. */
export function useSafeItemDetailQuery(id: string | null) {
  return useQuery({
    queryKey: safeItemDetailQueryKey(id ?? "none"),
    queryFn: () => workloadsService.getSafeItemDetail(id as string),
    enabled: id !== null,
  });
}
