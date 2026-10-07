import {useMutation, useQueryClient} from "@tanstack/react-query";
import {couriersService} from "@/services/couriers-service";
import type {CourierDetail, CourierVerificationItemKey} from "@/types/couriers-types";

/** Approves one verification item — the row's verification pill may move forward as a result. */
export function useApproveCourierVerificationMutation() {
  const queryClient = useQueryClient();
  return useMutation<CourierDetail, Error, {id: string; itemKey: CourierVerificationItemKey}>({
    mutationFn: ({id, itemKey}) => couriersService.approveVerificationItem(id, itemKey),
    onSuccess: (_data, {id}) => {
      void queryClient.invalidateQueries({queryKey: ["couriers", "detail", id]});
      void queryClient.invalidateQueries({queryKey: ["couriers", "list"]});
    },
  });
}
