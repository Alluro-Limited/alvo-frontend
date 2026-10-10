import {DialogClose, DialogTitle} from "@alvo/ui";
import {MapPin} from "lucide-react";
import {m} from "@/paraglide/messages";
import type {AssignmentDetail} from "@/types/assignment-types";
import wlClose from "@/assets/wl-close.svg";
import wlFlag from "@/assets/wl-flag.svg";
import {AssignmentStatusPill} from "./assignment-status-pill";

interface AssignmentDrawerHeaderProps {
  detail: AssignmentDetail | undefined;
  onFlag: () => void;
  onTrackMap: () => void;
}

/** Assignment drawer header: "Assignment" label, id, status pill, then map/flag/close actions. */
export function AssignmentDrawerHeader({detail, onFlag, onTrackMap}: AssignmentDrawerHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-3 border-b border-grey-200 bg-white px-4 py-3">
      <div>
        <DialogTitle className="text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{m["assignment.drawer_label"]()}</DialogTitle>
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-base leading-[1.4] font-semibold text-black">{detail?.id ?? "…"}</span>
          {detail && <AssignmentStatusPill status={detail.status} />}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onTrackMap}
          aria-label={m["assignment.track_map_aria"]()}
          className="rounded-lg bg-primary-50 p-2 text-primary-500 hover:bg-primary-100"
        >
          <MapPin className="size-4" aria-hidden="true" />
        </button>
        {detail && !detail.flag && (
          <button
            type="button"
            onClick={onFlag}
            aria-label={m["assignment.flag_aria"]()}
            className="rounded-lg bg-status-warning-subtle p-2 text-status-warning-dark hover:bg-status-warning-subtle/70"
          >
            <img src={wlFlag} alt="" className="size-4" aria-hidden="true" />
          </button>
        )}
        <DialogClose className="rounded p-0.5 text-grey-600 hover:bg-grey-100" aria-label={m["workloads.close"]()}>
          <img src={wlClose} alt="" className="size-6" aria-hidden="true" />
        </DialogClose>
      </div>
    </header>
  );
}
