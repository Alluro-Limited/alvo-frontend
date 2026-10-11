import {StatusTag, type StatusTagProps} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import type {BatchStatus, ShipmentStage} from "@/types/batch-types";

const BATCH_TAG: Record<BatchStatus, StatusTagProps["status"]> = {
  active: "success",
  issue: "pending",
  completed: "pickup",
  draft: "draft",
};

const BATCH_LABEL: Record<BatchStatus, () => string> = {
  active: m["batches.status_active"],
  issue: m["batches.status_issue"],
  completed: m["batches.status_completed"],
  draft: m["batches.status_draft"],
};

export function BatchStatusChip({status}: {status: BatchStatus}) {
  return <StatusTag status={BATCH_TAG[status]}>{BATCH_LABEL[status]()}</StatusTag>;
}

const STAGE_TAG: Record<ShipmentStage, StatusTagProps["status"]> = {
  awaiting_dropoff: "default",
  courier_assigned: "default",
  dropped_off: "default",
  in_transit: "pickup",
  ready_for_collection: "booked",
  delivered: "success",
  failed: "fail",
};

const STAGE_LABEL: Record<ShipmentStage, () => string> = {
  awaiting_dropoff: m["batches.stage_awaiting_dropoff"],
  courier_assigned: m["batches.stage_courier_assigned"],
  dropped_off: m["batches.stage_dropped_off"],
  in_transit: m["batches.stage_in_transit"],
  ready_for_collection: m["batches.stage_ready_collection"],
  delivered: m["batches.stage_delivered"],
  failed: m["batches.stage_failed"],
};

export function ShipmentStageChip({stage}: {stage: ShipmentStage}) {
  return <StatusTag status={STAGE_TAG[stage]}>{STAGE_LABEL[stage]()}</StatusTag>;
}
