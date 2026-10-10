import {useQuery} from "@tanstack/react-query";
import {assignmentsService} from "@/services/assignments-service";

/** Assignments eligible for manual assignment — fetched when step 1 of the modal opens. */
export function useAssignableQuery(enabled: boolean) {
  return useQuery({
    queryKey: ["assignments", "assignable"],
    queryFn: () => assignmentsService.getAssignable(),
    enabled,
    retry: false,
  });
}
