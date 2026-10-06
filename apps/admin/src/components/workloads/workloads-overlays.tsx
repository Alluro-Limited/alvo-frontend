import {FlagForReviewDialog} from "./flag-for-review-dialog";
import {ParcelDetailDrawer} from "./parcel-detail-drawer";
import {WorkloadsToast} from "./workloads-toast";
import type {useFlagFlow} from "./use-flag-flow";

interface WorkloadsOverlaysProps {
  drawerId: string | null;
  flag: ReturnType<typeof useFlagFlow>;
  onCloseDrawer: () => void;
}

/** The page's overlay layer: parcel drawer, flag modal, and the success toast. */
export function WorkloadsOverlays({drawerId, flag, onCloseDrawer}: WorkloadsOverlaysProps) {
  return (
    <>
      <ParcelDetailDrawer parcelId={drawerId} onClose={onCloseDrawer} onFlag={(id) => flag.openFlag([id])} />
      <FlagForReviewDialog
        open={flag.flagIds !== null}
        parcelIds={flag.flagIds ?? []}
        submitting={flag.submitting}
        failed={flag.failed}
        onClose={flag.closeFlag}
        onSubmit={flag.submit}
      />
      {flag.toast && <WorkloadsToast message={flag.toast} onDismiss={flag.dismissToast} />}
    </>
  );
}
