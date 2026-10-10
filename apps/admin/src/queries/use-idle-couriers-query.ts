import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {assignmentsService} from "@/services/assignments-service";

/** Idle couriers for manual-assign step 2 — server-side search by name or code. */
export function useIdleCouriersQuery(query: string, enabled: boolean) {
  return useQuery({
    queryKey: ["assignments", "idle-couriers", query],
    queryFn: () => assignmentsService.getIdleCouriers(query || undefined),
    enabled,
    retry: false,
    placeholderData: keepPreviousData,
  });
}
