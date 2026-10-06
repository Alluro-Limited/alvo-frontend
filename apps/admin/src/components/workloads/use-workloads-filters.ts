import {useCallback, useState} from "react";
import type {ParcelStatus, WorkloadListParams, WorkloadTab} from "@/types/workloads-types";

/** Tab/search/filter/page state for the Workloads page — any filter change returns to page 1. */
export function useWorkloadsFilters() {
  const [tab, setTab] = useState<WorkloadTab>("single");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ParcelStatus | "">("");
  const [nodeId, setNodeId] = useState("");
  const [page, setPage] = useState(1);

  const firstPage = useCallback(<T>(set: (v: T) => void) => {
    return (v: T) => {
      set(v);
      setPage(1);
    };
  }, []);

  const params: WorkloadListParams = {
    tab,
    query: query.trim() || undefined,
    status: status || undefined,
    nodeId: nodeId || undefined,
    page,
  };
  return {
    params,
    filters: {tab, query, status, nodeId},
    onTab: firstPage(setTab),
    onQuery: firstPage(setQuery),
    onStatus: firstPage(setStatus),
    onNode: firstPage(setNodeId),
    onPage: setPage,
  };
}
