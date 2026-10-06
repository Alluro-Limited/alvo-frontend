import {StatusTag} from "@alvo/ui";
import {cn} from "cnfast";
import type {BatchTag} from "@/types/workloads-types";
import {BATCH_TAG_LABELS} from "./batch-tag-labels";

const VARIANTS: Record<BatchTag, {status: "pickup" | "success" | "fail" | "pending" | "default"; className?: string}> = {
  active: {status: "default", className: "border-primary-500 bg-primary-50 text-primary-600"},
  completed: {status: "success"},
  queued: {status: "default"},
  stalled: {status: "pending"},
  flagged: {status: "fail"},
};

/** The status pills on a batch card/header ("Active", "Queued", "Stalled", ...). */
export function BatchTagPill({tag}: {tag: BatchTag}) {
  const variant = VARIANTS[tag];
  return (
    <StatusTag status={variant.status} className={cn("py-1", variant.className)}>
      {BATCH_TAG_LABELS[tag]()}
    </StatusTag>
  );
}
