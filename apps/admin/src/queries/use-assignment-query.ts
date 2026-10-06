import {useQuery} from "@tanstack/react-query";
import {assignmentsService} from "@/services/assignments-service";

export const assignmentQueryKey = (id: string) => ["assignments", "detail", id] as const;

/** The assignment drawer payload — progress, info rows, timeline, items. */
export function useAssignmentQuery(id: string | null) {
  return useQuery({
    queryKey: assignmentQueryKey(id ?? ""),
    queryFn: () => assignmentsService.getAssignmentDetail(id ?? ""),
    enabled: id !== null,
    retry: false,
  });
}
