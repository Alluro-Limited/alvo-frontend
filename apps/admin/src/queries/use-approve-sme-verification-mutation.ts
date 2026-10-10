import {useMutation, useQueryClient} from "@tanstack/react-query";
import {smesService} from "@/services/smes-service";
import type {SmeDetail} from "@/types/smes-types";

/** Approves one verification item — the row's verification pill may move forward as a result. */
export function useApproveSmeVerificationMutation() {
  const queryClient = useQueryClient();
  return useMutation<SmeDetail, Error, {id: string; itemKey: string}>({
    mutationFn: ({id, itemKey}) => smesService.approveVerificationItem(id, itemKey),
    onSuccess: (_data, {id}) => {
      void queryClient.invalidateQueries({queryKey: ["smes", "detail", id]});
      void queryClient.invalidateQueries({queryKey: ["smes", "list"]});
    },
  });
}
