import {useQuery} from "@tanstack/react-query";
import {dashboardService} from "@/services/dashboard-service";

export const overviewQueryKey = ["dashboard", "overview"] as const;
/** The map is the live view — refetch often enough for markers, KPIs, and alerts to stay fresh. */
export const OVERVIEW_POLL_MS = 30_000;

/** Overview data for the dashboard home, polled so the live view tracks backend changes. */
export function useOverviewQuery() {
  return useQuery({
    queryKey: overviewQueryKey,
    queryFn: dashboardService.getOverview,
    retry: false,
    refetchInterval: OVERVIEW_POLL_MS,
  });
}
