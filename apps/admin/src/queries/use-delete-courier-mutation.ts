import {useMutation, useQueryClient} from "@tanstack/react-query";
import {couriersService} from "@/services/couriers-service";
import type {DeleteCourierInput} from "@/types/couriers-types";

/** Permanently deletes a courier account, then refreshes courier queries. */
export function useDeleteCourierMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({id, input}: {id: string; input: DeleteCourierInput}) => couriersService.deleteCourier(id, input),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["couriers"]}),
  });
}
