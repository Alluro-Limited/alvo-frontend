import {useQuery} from "@tanstack/react-query";
import {dashboardService} from "@/services/dashboard-service";
import {OVERVIEW_POLL_MS} from "./use-overview-query";

/** A courier's popover detail, polled so progress/location stay live while open. */
export function useCourierDetailQuery(id: string) {
  return useQuery({
    queryKey: ["dashboard", "courier", id],
    queryFn: () => dashboardService.getCourierDetail(id),
    retry: false,
    refetchInterval: OVERVIEW_POLL_MS,
  });
}
