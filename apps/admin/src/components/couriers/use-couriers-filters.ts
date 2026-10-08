import {useCallback, useState} from "react";
import type {CourierExportParams, CourierListParams} from "@/types/couriers-types";

/** Search/status/verification/vehicle/page state for the couriers table — any filter change returns to page 1. */
export function useCouriersFilters() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [verification, setVerification] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [page, setPage] = useState(1);

  const firstPage = useCallback(<T>(set: (v: T) => void) => {
    return (v: T) => {
      set(v);
      setPage(1);
    };
  }, []);

  const shared = {
    query: query.trim() || undefined,
    status: status || undefined,
    verification: verification || undefined,
    vehicle: vehicle || undefined,
  };
  const listParams: CourierListParams = {...shared, page};
  /** The courier CSV export runs on the same filter set the list shows. */
  const exportParams: CourierExportParams = shared;
  const filtered =
    shared.query !== undefined || shared.status !== undefined || shared.verification !== undefined || shared.vehicle !== undefined;
  const clearFilters = useCallback(() => {
    setQuery("");
    setStatus("");
    setVerification("");
    setVehicle("");
    setPage(1);
  }, []);

  return {
    filters: {query, status, verification, vehicle},
    filtered,
    listParams,
    exportParams,
    onQuery: firstPage(setQuery),
    onStatus: firstPage(setStatus),
    onVerification: firstPage(setVerification),
    onVehicle: firstPage(setVehicle),
    onPage: setPage,
    clearFilters,
  };
}
