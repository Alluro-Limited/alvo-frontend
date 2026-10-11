import {useMemo, useState} from "react";
import type {BatchFilter, BatchDetail, BatchShipment, ShipmentStage} from "@/types/batch-types";

const ACTIVE_STAGES: ShipmentStage[] = ["awaiting_dropoff", "courier_assigned", "dropped_off", "in_transit", "ready_for_collection"];
const COMPLETED_STAGES: ShipmentStage[] = ["delivered", "failed"];

function stageMatches(stage: ShipmentStage, filter: BatchFilter) {
  if (filter === "all") return true;
  if (filter === "active") return ACTIVE_STAGES.includes(stage);
  if (filter === "completed") return COMPLETED_STAGES.includes(stage);
  return false; // "draft" — shipments are never drafts
}

/** Filter chips + search + the currently-tracked shipment for the detail page. */
export function useBatchDetail(batch: BatchDetail) {
  const [filter, setFilter] = useState<BatchFilter>("all");
  const [search, setSearch] = useState("");
  const [trackingId, setTrackingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return batch.shipments.filter((shipment: BatchShipment) => {
      const matchesStage = stageMatches(shipment.stage, filter);
      const matchesSearch = query === "" || shipment.recipient.toLowerCase().includes(query) || shipment.id.toLowerCase().includes(query);
      return matchesStage && matchesSearch;
    });
  }, [batch, filter, search]);

  return {filter, setFilter, search, setSearch, filtered, trackingId, setTrackingId};
}
