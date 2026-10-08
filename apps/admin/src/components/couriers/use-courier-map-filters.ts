import {useCallback, useState} from "react";
import type {CourierTrackingParams} from "@/types/couriers-types";

/** Search/status/delivery-type state for the tracking map — independent of the account-list filters. */
export function useCourierMapFilters() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  const params: CourierTrackingParams = {
    query: query.trim() || undefined,
    status: status || undefined,
    type: type || undefined,
  };
  const filtered = params.query !== undefined || params.status !== undefined || params.type !== undefined;
  const clearFilters = useCallback(() => {
    setQuery("");
    setStatus("");
    setType("");
  }, []);

  return {filters: {query, status, type}, params, filtered, onQuery: setQuery, onStatus: setStatus, onType: setType, clearFilters};
}
