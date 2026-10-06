import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {nodesService} from "@/services/nodes-service";
import type {NodeListParams} from "@/types/nodes-types";

export const nodesQueryKey = (params: NodeListParams) => ["nodes", "list", params] as const;

/** Metrics + the filtered, paginated node list. Previous page data stays while the next loads. */
export function useNodesQuery(params: NodeListParams) {
  return useQuery({
    queryKey: nodesQueryKey(params),
    queryFn: () => nodesService.getNodes(params),
    retry: false,
    placeholderData: keepPreviousData,
  });
}
