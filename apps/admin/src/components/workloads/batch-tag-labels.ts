import {m} from "@/paraglide/messages";
import type {BatchTag} from "@/types/workloads-types";

/** Batch tag → label shared by the card pills, the status filter, and the detail header. */
export const BATCH_TAG_LABELS: Record<BatchTag, () => string> = {
  active: m["workloads.tag_active"],
  completed: m["workloads.tag_completed"],
  queued: m["workloads.tag_queued"],
  stalled: m["workloads.tag_stalled"],
  flagged: m["workloads.tag_flagged"],
};
