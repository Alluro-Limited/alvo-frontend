import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {assignmentsService} from "@/services/assignments-service";
import type {AssignmentListParams} from "@/types/assignment-types";

export const assignmentsQueryKey = (params: AssignmentListParams) => ["assignments", "list", params] as const;

/** Metrics + the filtered, paginated assignment list. Previous page data stays while the next loads. */
export function useAssignmentsQuery(params: AssignmentListParams) {
  return useQuery({
    queryKey: assignmentsQueryKey(params),
    queryFn: () => assignmentsService.getAssignments(params),
    retry: false,
    placeholderData: keepPreviousData,
  });
}
