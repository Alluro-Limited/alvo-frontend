import {useMutation, useQueryClient} from "@tanstack/react-query";
import {smesService} from "@/services/smes-service";
import type {DeactivateSmeInput} from "@/types/smes-types";

/** Permanently deactivates an SME account, then refreshes the list. */
export function useDeactivateSmeMutation() {
  const queryClient = useQueryClient();
  return useMutation<{id: string}, Error, {id: string; input: DeactivateSmeInput}>({
    mutationFn: ({id, input}) => smesService.deactivateSme(id, input),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["smes"]}),
  });
}
