import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {batchesService} from "@/services/batches-service";
import {dashboardKeys} from "./use-dashboard-queries";

export const batchKeys = {
  all: ["batches"] as const,
  list: () => [...batchKeys.all, "list"] as const,
  detail: (id: string) => [...batchKeys.all, "detail", id] as const,
  tracking: (shipmentId: string) => [...batchKeys.all, "tracking", shipmentId] as const,
};

export function useBatchesQuery() {
  return useQuery({queryKey: batchKeys.list(), queryFn: batchesService.getBatches});
}

export function useBatchDetailQuery(id: string) {
  return useQuery({queryKey: batchKeys.detail(id), queryFn: () => batchesService.getBatch(id)});
}

/** Fetches lazily — the overlay only mounts the query once a shipment is tracked. */
export function useShipmentTrackingQuery(shipmentId: string | null) {
  return useQuery({
    queryKey: batchKeys.tracking(shipmentId ?? ""),
    queryFn: () => batchesService.getShipmentTracking(shipmentId ?? ""),
    enabled: shipmentId !== null,
  });
}

export function useDeleteBatchMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: batchesService.deleteBatch,
    onSuccess: () => {
      void queryClient.invalidateQueries({queryKey: batchKeys.list()});
      void queryClient.invalidateQueries({queryKey: dashboardKeys.overview});
    },
  });
}
