import {useListFilters} from "@/components/workloads/use-list-filters";
import type {AssignmentListParams} from "@/types/assignment-types";

/** Search/status/type/page state for the assignment list — the shared filter hook with `location` as the type field. */
export function useAssignmentFilters() {
  const {filters, listParams, clearFilters, onQuery, onStatus, onLocation, onPage} = useListFilters();
  const params: AssignmentListParams = {
    query: listParams.query,
    status: listParams.status,
    type: listParams.location,
    page: listParams.page,
  };
  return {
    filters: {query: filters.query, status: filters.status, type: filters.location},
    params,
    onQuery,
    onStatus,
    onType: onLocation,
    onPage,
    clearFilters,
  };
}
