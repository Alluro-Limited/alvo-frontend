import type {WorkloadListParams} from "@/types/workloads-types";
import {useListFilters} from "./use-list-filters";

/** Search/filter/page state for the parcel table inside a batch detail page. */
export function useBatchParcelFilters() {
  const list = useListFilters();
  const params: WorkloadListParams = {tab: "batches", ...list.listParams};
  return {
    params,
    filters: list.filters,
    onQuery: list.onQuery,
    onStatus: list.onStatus,
    onLocation: list.onLocation,
    onPage: list.onPage,
  };
}
