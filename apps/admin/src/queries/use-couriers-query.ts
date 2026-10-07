import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {couriersService} from "@/services/couriers-service";
import type {CourierListParams} from "@/types/couriers-types";

export const couriersQueryKey = (params: CourierListParams) => ["couriers", "list", params] as const;

/** Metrics + the filtered, paginated courier list. Previous page data stays while the next loads. */
export function useCouriersQuery(params: CourierListParams) {
  return useQuery({
    queryKey: couriersQueryKey(params),
    queryFn: () => couriersService.getCouriers(params),
    retry: false,
    placeholderData: keepPreviousData,
  });
}
