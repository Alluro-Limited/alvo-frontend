import type {ReactNode} from "react";
import {FlagForReviewDialog} from "./flag-for-review-dialog";
import {WorkloadsToast} from "./workloads-toast";
import type {useFlagFlow} from "./use-flag-flow";

interface WorkloadsOverlaysProps {
  /** The active tab's item drawer (parcel or Safe), wired by the page. */
  drawer: ReactNode;
  /** Entity noun in the flag modal's subtitle — "item" on the Safe tab. */
  noun?: "parcel" | "item";
  flag: ReturnType<typeof useFlagFlow>;
}

/** The page's overlay layer: the item drawer, flag modal, and the success toast. */
export function WorkloadsOverlays({drawer, noun, flag}: WorkloadsOverlaysProps) {
  return (
    <>
      {drawer}
      <FlagForReviewDialog
        open={flag.flagIds !== null}
        parcelIds={flag.flagIds ?? []}
        submitting={flag.submitting}
        failed={flag.failed}
        noun={noun}
        onClose={flag.closeFlag}
        onSubmit={flag.submit}
      />
      {flag.toast && <WorkloadsToast message={flag.toast} onDismiss={flag.dismissToast} />}
    </>
  );
}
