import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {couriersService} from "@/services/couriers-service";
import type {CourierTrackingParams} from "@/types/couriers-types";

export const courierTrackingQueryKey = (params: CourierTrackingParams) => ["couriers", "tracking", params] as const;

/** Active courier assignments for the tracking map — unpaginated so every marker renders at once. */
export function useCourierTrackingQuery(params: CourierTrackingParams) {
  return useQuery({
    queryKey: courierTrackingQueryKey(params),
    queryFn: () => couriersService.getCourierTracking(params),
    retry: false,
    placeholderData: keepPreviousData,
  });
}
