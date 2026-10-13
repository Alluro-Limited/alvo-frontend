import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {activityService} from "@/services/activity-service";

export const activityKeys = {
  list: ["activities"] as const,
  detail: (id: string) => ["deliveries", id] as const,
  extendPreview: (id: string, hours: number) => ["deliveries", id, "extend-preview", hours] as const,
};

export function useActivitiesQuery() {
  return useQuery({queryKey: activityKeys.list, queryFn: () => activityService.getActivities()});
}

export function useDeliveryQuery(id: string) {
  return useQuery({queryKey: activityKeys.detail(id), queryFn: () => activityService.getDelivery(id)});
}

/** Preview of the new drop-off deadline for the selected duration — only runs once `hours` is picked. */
export function useExtendPreview(id: string, hours: number | null) {
  return useQuery({
    queryKey: activityKeys.extendPreview(id, hours ?? 0),
    queryFn: () => activityService.previewDropoffExtension(id, hours ?? 0),
    enabled: hours !== null,
  });
}

export function useExtendDropoff(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (hours: number) => activityService.extendDropoff(id, hours),
    onSuccess: () => queryClient.invalidateQueries({queryKey: activityKeys.detail(id)}),
  });
}

/** Preview of the paid pickup reactivation — runs once `hours` is picked; carries the extension fee. */
export function usePickupPreview(id: string, hours: number | null) {
  return useQuery({
    queryKey: [...activityKeys.detail(id), "pickup-preview", hours ?? 0] as const,
    queryFn: () => activityService.previewPickupExtension(id, hours ?? 0),
    enabled: hours !== null,
  });
}

export function useReactivatePickup(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({hours, channel}: {hours: number; channel: "wallet" | "online"}) => activityService.reactivatePickup(id, hours, channel),
    onSuccess: () => queryClient.invalidateQueries({queryKey: activityKeys.detail(id)}),
  });
}

/** Pays the locker-size difference; on success the detail + feed refetch with the shipment back in flight. */
export function useUpgradeLocker(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (channel: "wallet" | "online") => activityService.upgradeLocker(id, channel),
    onSuccess: () => {
      void queryClient.invalidateQueries({queryKey: activityKeys.detail(id)});
      void queryClient.invalidateQueries({queryKey: activityKeys.list});
    },
  });
}

export function useCancelShipment(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => activityService.cancelShipment(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({queryKey: activityKeys.detail(id)});
      void queryClient.invalidateQueries({queryKey: activityKeys.list});
    },
  });
}

/** Sends the OTP that unmasks a safe pickup code; called on sheet open and on "Resend Link". */
export function useSendPickupVerification(id: string) {
  return useMutation({mutationFn: () => activityService.sendPickupVerification(id)});
}

/** Wrong codes reject with `invalid_code`; success invalidates the detail so the masked code reveals itself. */
export function useVerifyPickup(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => activityService.verifyPickup(id, code),
    onSuccess: () => queryClient.invalidateQueries({queryKey: activityKeys.detail(id)}),
  });
}
