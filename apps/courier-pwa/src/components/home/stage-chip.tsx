import type {JobStage} from "@/types/home-types";
import {m} from "@/paraglide/messages";

const CHIP_STYLE: Record<JobStage, string> = {
  assignment: "text-[11px] font-semibold tracking-wide text-grey-500 uppercase",
  pending: "rounded-full bg-status-warning-subtle px-2.5 py-1 text-[12px] font-medium text-status-warning-dark",
  enroute: "rounded-full bg-secondary-50 px-2.5 py-1 text-[12px] font-medium text-secondary-600",
  complete: "rounded-full bg-status-success-subtle px-2.5 py-1 text-[12px] font-medium text-status-success-dark",
};

const LABEL: Record<JobStage, () => string> = {
  assignment: m["home.stage_assignment"],
  pending: m["home.stage_pending"],
  enroute: m["home.stage_enroute"],
  complete: m["home.stage_complete"],
};

/** The stage label in the job card's top-right corner. */
export function StageChip({stage}: {stage: JobStage}) {
  return <span className={CHIP_STYLE[stage]}>{LABEL[stage]()}</span>;
}
