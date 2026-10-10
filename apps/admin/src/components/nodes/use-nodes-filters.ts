import {useListFilters} from "@/components/workloads/use-list-filters";
import type {NodeListParams} from "@/types/nodes-types";

/** Search/status/page state for the nodes list — the shared filter hook minus the location field. */
export function useNodesFilters() {
  const {filters, listParams, clearFilters, onQuery, onStatus, onPage} = useListFilters();
  const params: NodeListParams = {query: listParams.query, status: listParams.status, page: listParams.page};
  return {filters: {query: filters.query, status: filters.status}, params, onQuery, onStatus, onPage, clearFilters};
}
