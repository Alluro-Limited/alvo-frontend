import {useMutation, useQueryClient} from "@tanstack/react-query";
import {workloadsService} from "@/services/workloads-service";
import type {FlagParcelsInput} from "@/types/workloads-types";

/** Flags parcels for review, then refreshes every workloads query so the table/drawer show it. */
export function useFlagParcelsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: FlagParcelsInput) => workloadsService.flagParcels(input),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["workloads"]}),
  });
}
