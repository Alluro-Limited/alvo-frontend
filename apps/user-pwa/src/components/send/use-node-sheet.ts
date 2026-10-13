import {useState} from "react";
import type {NodeFilter} from "./node-search";
import type {LockerNode} from "@/types/send-types";

/** Search + chip-filter state for the Select Locker sheet, including the "Near Me" geolocation gate. */
export function useNodeSheetFilters(nodes: LockerNode[], excludeId: string | null, favoriteId: string | null) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<NodeFilter>("all");
  const [nearGranted, setNearGranted] = useState(false);

  const q = query.trim().toLowerCase();
  const needsLocation = filter === "near" && !nearGranted;
  const visible = needsLocation
    ? []
    : nodes.filter(
        (n) =>
          n.id !== excludeId &&
          (filter !== "favorites" || n.id === favoriteId) &&
          (!q || n.name.toLowerCase().includes(q) || n.address.toLowerCase().includes(q))
      );

  const reset = () => {
    setQuery("");
    setFilter("all");
  };

  const allowLocation = () => {
    if (!navigator.geolocation) return setNearGranted(true);
    navigator.geolocation.getCurrentPosition(
      () => setNearGranted(true),
      () => setNearGranted(false)
    );
  };

  return {query, filter, needsLocation, visible, setQuery, setFilter, reset, allowLocation};
}
