import {useMemo, useState} from "react";
import type {PayoutExportParams, PayoutListParams} from "@/types/payouts-types";

/** Cycle + search + status + page state for the payout console — all feed the list query and CSV export. */
export function usePayoutsFilters() {
  const [cycle, setCycle] = useState("2026-06B");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const filtered = query.trim() !== "" || status !== "";

  const listParams = useMemo<PayoutListParams>(() => ({cycle, query, status, page}), [cycle, query, status, page]);
  const exportParams = useMemo<PayoutExportParams>(() => ({cycle, query, status}), [cycle, query, status]);

  const onQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };
  const onStatus = (value: string) => {
    setStatus(value);
    setPage(1);
  };
  const clearFilters = () => {
    setQuery("");
    setStatus("");
    setPage(1);
  };

  return {
    cycle,
    query,
    status,
    page,
    filtered,
    listParams,
    exportParams,
    onCycle: setCycle,
    onQuery,
    onStatus,
    onPage: setPage,
    clearFilters,
  };
}
