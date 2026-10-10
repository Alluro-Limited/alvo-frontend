import {useMutation, useQueryClient} from "@tanstack/react-query";
import {assignmentsService} from "@/services/assignments-service";
import type {AssignCourierInput} from "@/types/assignment-types";

/** Manually assigns a courier, then refreshes assignment queries so list and detail reflect it. */
export function useAssignCourierMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AssignCourierInput) => assignmentsService.assignCourier(input),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["assignments"]}),
  });
}
