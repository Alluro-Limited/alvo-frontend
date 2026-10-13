import {Link} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";

interface JobCardActionsProps {
  jobId: string;
  assignment: boolean;
  pending: boolean;
  onDecline: () => void;
  onAccept: () => void;
}

/** Card footer: Decline/Accept while the offer is open, otherwise the View Details row. */
export function JobCardActions({jobId, assignment, pending, onDecline, onAccept}: JobCardActionsProps) {
  if (!assignment) {
    return (
      <Link
        to="/deliveries/$jobId"
        params={{jobId}}
        className="mt-3 flex h-[44px] w-full items-center justify-center rounded-[10px] bg-grey-100 text-[15px] font-semibold text-primary-600"
      >
        {m["home.view_details"]()}
      </Link>
    );
  }

  return (
    <div className="mt-3 flex gap-3">
      <button
        type="button"
        onClick={onDecline}
        disabled={pending}
        className="h-[44px] flex-1 rounded-[10px] bg-danger-50 text-[15px] font-semibold text-danger-600 disabled:opacity-60"
      >
        {m["home.decline"]()}
      </button>
      <button
        type="button"
        onClick={onAccept}
        disabled={pending}
        className="h-[44px] flex-1 rounded-[10px] bg-primary-500 text-[15px] font-semibold text-white disabled:opacity-60"
      >
        {m["home.accept"]()}
      </button>
    </div>
  );
}
