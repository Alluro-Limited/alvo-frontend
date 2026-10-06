import {useCallback} from "react";
import {useNavigate, useSearch} from "@tanstack/react-router";
import type {WorkloadListParams, WorkloadTab} from "@/types/workloads-types";
import {useListFilters} from "./use-list-filters";

function parseTab(value: string | undefined): WorkloadTab {
  return value === "batches" || value === "safe" ? value : "single";
}

/** Tab (URL search param) plus shared list filters for the Workloads page. */
export function useWorkloadsFilters() {
  const search = useSearch({strict: false}) as {tab?: string};
  const navigate = useNavigate();
  const tab = parseTab(search.tab);
  const {filters, listParams, onQuery, onStatus, onLocation, onPage} = useListFilters();

  const onTab = useCallback(
    (next: WorkloadTab) => {
      onPage(1);
      void navigate({to: "/workloads", search: {tab: next}});
    },
    [onPage, navigate]
  );

  const params: WorkloadListParams = {tab, ...listParams};
  return {params, filters: {tab, ...filters}, onTab, onQuery, onStatus, onLocation, onPage};
}
