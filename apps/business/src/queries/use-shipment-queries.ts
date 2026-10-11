import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {shipmentService} from "@/services/shipment-service";
import {dashboardKeys} from "./use-dashboard-queries";

export const shipmentKeys = {
  lockers: ["shipments", "lockers"] as const,
};

export function useLockersQuery() {
  return useQuery({queryKey: shipmentKeys.lockers, queryFn: shipmentService.getLockers});
}

/** Creating a batch changes the wallet balance, spend stats, and notifications — refresh all of it. */
export function useCreateBatchMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: shipmentService.createBatch,
    onSuccess: () => {
      void queryClient.invalidateQueries({queryKey: dashboardKeys.overview});
      void queryClient.invalidateQueries({queryKey: dashboardKeys.notifications});
    },
  });
}
