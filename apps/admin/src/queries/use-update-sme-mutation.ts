import {useMutation, useQueryClient} from "@tanstack/react-query";
import {smesService} from "@/services/smes-service";
import type {SmeDetail, SmeUpdateInput} from "@/types/smes-types";

/** Saves the Edit info modal — the returned detail repopulates the drawer. */
export function useUpdateSmeMutation() {
  const queryClient = useQueryClient();
  return useMutation<SmeDetail, Error, {id: string; input: SmeUpdateInput}>({
    mutationFn: ({id, input}) => smesService.updateSme(id, input),
    onSuccess: (_data, {id}) => {
      void queryClient.invalidateQueries({queryKey: ["smes", "detail", id]});
      void queryClient.invalidateQueries({queryKey: ["smes", "list"]});
    },
  });
}
