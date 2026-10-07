import {useCallback, useState} from "react";
import type {UserListParams} from "@/types/users-types";

/** Search/status/verification/page state for the users table — any filter change returns to page 1. */
export function useUsersFilters() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [verification, setVerification] = useState("");
  const [page, setPage] = useState(1);

  const firstPage = useCallback(<T>(set: (v: T) => void) => {
    return (v: T) => {
      set(v);
      setPage(1);
    };
  }, []);

  const listParams: UserListParams = {
    query: query.trim() || undefined,
    status: status || undefined,
    verification: verification || undefined,
    page,
  };
  const clearFilters = useCallback(() => {
    setQuery("");
    setStatus("");
    setVerification("");
    setPage(1);
  }, []);

  return {
    filters: {query, status, verification},
    listParams,
    onQuery: firstPage(setQuery),
    onStatus: firstPage(setStatus),
    onVerification: firstPage(setVerification),
    onPage: setPage,
    clearFilters,
  };
}
