import {useMutation, useQueryClient} from "@tanstack/react-query";
import {couriersService} from "@/services/couriers-service";
import type {FlagCouriersInput} from "@/types/couriers-types";

/** Flags one or more courier accounts for review, then refreshes courier queries. */
export function useFlagCouriersMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: FlagCouriersInput) => couriersService.flagCouriers(input),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["couriers"]}),
  });
}
