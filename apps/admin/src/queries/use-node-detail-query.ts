import {useQuery} from "@tanstack/react-query";
import {dashboardService} from "@/services/dashboard-service";
import {OVERVIEW_POLL_MS} from "./use-overview-query";

/** A node's popover detail, polled so heartbeat/uptime stay live while open. */
export function useNodeDetailQuery(id: string) {
  return useQuery({
    queryKey: ["dashboard", "node", id],
    queryFn: () => dashboardService.getNodeDetail(id),
    retry: false,
    refetchInterval: OVERVIEW_POLL_MS,
  });
}
