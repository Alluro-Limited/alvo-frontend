import {useCallback, useState} from "react";
import type {WorkloadListParams} from "@/types/workloads-types";

/** Search/status/location/page state shared by the workloads and batch-parcel tables — any filter change returns to page 1. */
export function useListFilters() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);

  const firstPage = useCallback(<T>(set: (v: T) => void) => {
    return (v: T) => {
      set(v);
      setPage(1);
    };
  }, []);

  const listParams: Pick<WorkloadListParams, "query" | "status" | "location" | "page"> = {
    query: query.trim() || undefined,
    status: status || undefined,
    location: location || undefined,
    page,
  };
  return {
    filters: {query, status, location},
    listParams,
    onQuery: firstPage(setQuery),
    onStatus: firstPage(setStatus),
    onLocation: firstPage(setLocation),
    onPage: setPage,
  };
}
