import {useMutation, useQueryClient} from "@tanstack/react-query";
import {nodesService} from "@/services/nodes-service";
import type {RegisterNodeInput} from "@/types/nodes-types";

/** Registers a node, then refreshes every nodes query so the new row appears in the list. */
export function useRegisterNodeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: RegisterNodeInput) => nodesService.registerNode(input),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["nodes"]}),
  });
}
