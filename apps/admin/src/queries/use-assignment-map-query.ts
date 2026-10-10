import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {assignmentsService} from "@/services/assignments-service";
import type {AssignmentMapParams} from "@/types/assignment-types";

export const assignmentMapQueryKey = (params: AssignmentMapParams) => ["assignments", "map", params] as const;

/** Every assignment matching the filters — drives the map markers and the floating cards panel. */
export function useAssignmentMapQuery(params: AssignmentMapParams) {
  return useQuery({
    queryKey: assignmentMapQueryKey(params),
    queryFn: () => assignmentsService.getAssignmentMap(params),
    retry: false,
    placeholderData: keepPreviousData,
  });
}
