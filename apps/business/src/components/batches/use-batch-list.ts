import {useMemo, useState} from "react";
import type {BatchFilter, BatchPeriod, BatchSummary} from "@/types/batch-types";

/** Status-tab + search + period state for the batches table. */
export function useBatchList(batches: BatchSummary[]) {
  const [filter, setFilter] = useState<BatchFilter>("all");
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState<BatchPeriod>("30d");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return batches.filter((batch) => {
      const matchesFilter = filter === "all" || batch.status === filter;
      const matchesSearch = query === "" || batch.name.toLowerCase().includes(query) || batch.id.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [batches, filter, search]);

  return {filter, setFilter, search, setSearch, period, setPeriod, filtered};
}
