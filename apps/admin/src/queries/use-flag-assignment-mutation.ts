import {useMutation, useQueryClient} from "@tanstack/react-query";
import {assignmentsService} from "@/services/assignments-service";
import type {FlagAssignmentInput} from "@/types/assignment-types";

interface FlagAssignmentsInput extends FlagAssignmentInput {
  ids: string[];
}

/** Flags one or more assignments for review, then refreshes assignment queries for banners/pills. */
export function useFlagAssignmentsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ids, reason, notes}: FlagAssignmentsInput) => {
      await Promise.all(ids.map((id) => assignmentsService.flagAssignment(id, {reason, notes})));
      return ids;
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["assignments"]}),
  });
}
