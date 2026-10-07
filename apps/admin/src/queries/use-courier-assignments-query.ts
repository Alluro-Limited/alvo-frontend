import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {couriersService} from "@/services/couriers-service";
import type {CourierAssignmentsParams} from "@/types/couriers-types";

export const courierAssignmentsQueryKey = (id: string, params: CourierAssignmentsParams) =>
  ["couriers", "assignments", id, params] as const;

/** The drawer's Assignment History modal — filtered, paginated deliveries for this courier. */
export function useCourierAssignmentsQuery(id: string | null, params: CourierAssignmentsParams) {
  return useQuery({
    queryKey: courierAssignmentsQueryKey(id ?? "", params),
    queryFn: () => couriersService.getCourierAssignments(id ?? "", params),
    enabled: id !== null,
    retry: false,
    placeholderData: keepPreviousData,
  });
}
