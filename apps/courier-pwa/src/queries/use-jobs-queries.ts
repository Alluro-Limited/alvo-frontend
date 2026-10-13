import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {jobsService} from "@/services/jobs-service";

export const jobsKeys = {
  all: ["jobs"] as const,
};

export function useJobsQuery() {
  return useQuery({queryKey: jobsKeys.all, queryFn: () => jobsService.getJobs()});
}

/** After the confirm dialog — the offer leaves the list and the courier gets the delivery. */
export function useAcceptJobOfferMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => jobsService.acceptJob(jobId),
    onSuccess: () => queryClient.invalidateQueries({queryKey: jobsKeys.all}),
  });
}

export function useDeclineJobOfferMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => jobsService.declineJob(jobId),
    onSuccess: () => queryClient.invalidateQueries({queryKey: jobsKeys.all}),
  });
}
