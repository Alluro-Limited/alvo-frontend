import {useMemo, useState} from "react";
import type {AdminListParams} from "@/types/admins-types";

/** Search + status + role + page state for the admins console — feeds the list query. */
export function useAdminsFilters() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);

  const filtered = query.trim() !== "" || status !== "" || role !== "";
  const listParams = useMemo<AdminListParams>(() => ({query, status, role, page}), [query, status, role, page]);

  const onQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };
  const onStatus = (value: string) => {
    setStatus(value);
    setPage(1);
  };
  const onRole = (value: string) => {
    setRole(value);
    setPage(1);
  };
  const clearFilters = () => {
    setQuery("");
    setStatus("");
    setRole("");
    setPage(1);
  };

  return {query, status, role, page, filtered, listParams, onQuery, onStatus, onRole, onPage: setPage, clearFilters};
}
