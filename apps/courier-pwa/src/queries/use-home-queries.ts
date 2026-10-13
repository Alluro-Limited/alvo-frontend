import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {homeService} from "@/services/home-service";

export const homeKeys = {
  all: ["home"] as const,
};

export function useCourierHomeQuery() {
  return useQuery({queryKey: homeKeys.all, queryFn: () => homeService.getHome()});
}

/** The live/offline toggle in the header pill. */
export function useSetAvailabilityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (live: boolean) => homeService.setAvailability(live),
    onSuccess: () => queryClient.invalidateQueries({queryKey: homeKeys.all}),
  });
}

/** Confirmed in the "Confirm job acceptance" dialog — the card swaps to the pending state. */
export function useAcceptJobMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => homeService.acceptJob(jobId),
    onSuccess: () => queryClient.invalidateQueries({queryKey: homeKeys.all}),
  });
}

/** Removes the offer; the section falls back to its empty state. */
export function useDeclineJobMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => homeService.declineJob(jobId),
    onSuccess: () => queryClient.invalidateQueries({queryKey: homeKeys.all}),
  });
}

export const areaKeys = {
  all: ["delivery-areas"] as const,
};

export function useAreasQuery() {
  return useQuery({queryKey: areaKeys.all, queryFn: () => homeService.getAreas()});
}

/** "Confirm Area" on the picker — refreshes the home header's area label. */
export function useSetDeliveryAreaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (areaId: string) => homeService.setDeliveryArea(areaId),
    onSuccess: () => queryClient.invalidateQueries({queryKey: homeKeys.all}),
  });
}
