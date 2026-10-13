import {cn} from "cnfast";
import type {JobStage} from "@/types/home-types";

const SEGMENTS = 4;

/** Filled segments and marker position per stage; the marker sits on the current boundary. */
const STAGE_PROGRESS: Record<JobStage, number> = {
  assignment: 0,
  pending: 0,
  enroute: 2.5,
  complete: SEGMENTS,
};

/** The four-segment route bar inside a job card, with a white marker on the current point. */
export function JobProgress({stage}: {stage: JobStage}) {
  const progress = STAGE_PROGRESS[stage];

  return (
    <div className="relative flex items-center gap-1.5 py-1">
      {Array.from({length: SEGMENTS}, (_, i) => (
        <span key={i} className={cn("h-1.5 flex-1 rounded-full", i < Math.floor(progress) ? "bg-primary-500" : "bg-grey-200")} />
      ))}
      {progress > 0 && progress < SEGMENTS && (
        <span
          aria-hidden="true"
          className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary-500 bg-white"
          style={{left: `${(progress / SEGMENTS) * 100}%`}}
        />
      )}
      {progress === 0 && (
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-0 size-3 -translate-y-1/2 rounded-full border-2 border-primary-500 bg-white"
        />
      )}
    </div>
  );
}
