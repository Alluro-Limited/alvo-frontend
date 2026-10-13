import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {deliveriesService} from "@/services/deliveries-service";
import {homeService} from "@/services/home-service";
import {homeKeys} from "./use-home-queries";

export const deliveriesKeys = {
  all: ["deliveries-tab"] as const,
  analytics: ["deliveries-tab", "analytics"] as const,
};

export function useDeliveriesQuery() {
  return useQuery({queryKey: deliveriesKeys.all, queryFn: () => deliveriesService.getDeliveries()});
}

export function useAnalyticsQuery() {
  return useQuery({queryKey: deliveriesKeys.analytics, queryFn: () => deliveriesService.getAnalytics()});
}

function useJobActionMutation(fn: (jobId: string) => Promise<void>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      void queryClient.invalidateQueries({queryKey: deliveriesKeys.all});
      void queryClient.invalidateQueries({queryKey: homeKeys.all});
    },
  });
}

/** Accept/decline the milestone job — same backend action as the home card, both tabs invalidate. */
export function useAcceptActiveMutation() {
  return useJobActionMutation((jobId) => homeService.acceptJob(jobId));
}

export function useDeclineActiveMutation() {
  return useJobActionMutation((jobId) => homeService.declineJob(jobId));
}
