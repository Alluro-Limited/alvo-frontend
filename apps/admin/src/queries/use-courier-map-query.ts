import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {couriersService} from "@/services/couriers-service";
import type {CourierMapParams} from "@/types/couriers-types";

export const courierMapQueryKey = (params: CourierMapParams) => ["couriers", "map", params] as const;

/** Every courier matching the map filters — unpaginated so all markers render at once. */
export function useCourierMapQuery(params: CourierMapParams) {
  return useQuery({
    queryKey: courierMapQueryKey(params),
    queryFn: () => couriersService.getCourierMap(params),
    retry: false,
    placeholderData: keepPreviousData,
  });
}
