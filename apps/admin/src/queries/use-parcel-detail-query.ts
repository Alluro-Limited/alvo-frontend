import {useQuery} from "@tanstack/react-query";
import {workloadsService} from "@/services/workloads-service";

export const parcelDetailQueryKey = (id: string) => ["workloads", "parcel", id] as const;

/** Parcel detail behind the drawer — refetches on invalidation after a flag mutation. */
export function useParcelDetailQuery(id: string | null) {
  return useQuery({
    queryKey: parcelDetailQueryKey(id ?? ""),
    queryFn: () => workloadsService.getParcelDetail(id ?? ""),
    enabled: id !== null,
    retry: false,
  });
}
