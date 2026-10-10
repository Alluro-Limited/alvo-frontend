import {useQuery} from "@tanstack/react-query";
import {nodesService} from "@/services/nodes-service";

export const nodeQueryKey = (id: string) => ["nodes", "detail", id] as const;

/** The node detail page payload — header, capacity, sensors, contents, and maintenance log. */
export function useNodeQuery(id: string) {
  return useQuery({
    queryKey: nodeQueryKey(id),
    queryFn: () => nodesService.getNodeDetail(id),
    retry: false,
  });
}
