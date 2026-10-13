import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {deliveryService} from "@/services/delivery-service";
import type {DeliveryStatus} from "@/types/delivery-types";

export const deliveryKeys = {
  all: ["deliveries"] as const,
  detail: (jobId: string) => [...deliveryKeys.all, jobId] as const,
};

export function useDeliveryQuery(jobId: string) {
  return useQuery({queryKey: deliveryKeys.detail(jobId), queryFn: () => deliveryService.getDelivery(jobId)});
}

/** "Tap to Scan Barcode" — the camera picks the next unscanned manifest package. */
export function useScanNextMutation(jobId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deliveryService.scanNextPackage(jobId),
    onSuccess: () => queryClient.invalidateQueries({queryKey: deliveryKeys.detail(jobId)}),
  });
}

/** Manual barcode entry — 404 not in manifest, 409 already scanned. */
export function useScanPackageMutation(jobId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => deliveryService.scanPackage(jobId, code),
    onSuccess: () => queryClient.invalidateQueries({queryKey: deliveryKeys.detail(jobId)}),
  });
}

/** Status-tab radio + "Confirm Status Update". */
export function useUpdateStatusMutation(jobId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: DeliveryStatus) => deliveryService.updateStatus(jobId, status),
    onSuccess: () => queryClient.invalidateQueries({queryKey: deliveryKeys.detail(jobId)}),
  });
}
