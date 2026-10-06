import {useMutation, useQueryClient} from "@tanstack/react-query";
import {nodesService} from "@/services/nodes-service";
import type {ChangeNodeStatusInput} from "@/types/nodes-types";

/** Applies a node status change, then refreshes nodes queries so the detail and list reflect it. */
export function useChangeNodeStatusMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ChangeNodeStatusInput) => nodesService.changeNodeStatus(id, input),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["nodes"]}),
  });
}
