import {useQuery} from "@tanstack/react-query";
import {couriersService} from "@/services/couriers-service";

export const courierQueryKey = (id: string) => ["couriers", "detail", id] as const;

/** The courier drawer payload — info, verification items, performance, flag/suspension records. */
export function useCourierQuery(id: string | null) {
  return useQuery({
    queryKey: courierQueryKey(id ?? ""),
    queryFn: () => couriersService.getCourierDetail(id ?? ""),
    enabled: id !== null,
    retry: false,
  });
}
