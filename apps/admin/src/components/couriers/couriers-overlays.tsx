import {m} from "@/paraglide/messages";
import {FlagForReviewDialog} from "@/components/workloads/flag-for-review-dialog";
import type {CourierDeleteReason, CourierSuspendReason} from "@/types/couriers-types";
import {CourierDocViewer} from "./courier-doc-viewer";
import {CourierDrawer} from "./courier-drawer";
import {CourierHistoryModal} from "./courier-history-modal";
import {CouriersToast} from "./couriers-toast";
import {DeleteCourierDialog} from "./delete-courier-dialog";
import {SuspendCourierDialog} from "./suspend-courier-dialog";
import type {useCourierApproveFlow} from "./use-courier-approve-flow";
import type {useCourierDeleteFlow} from "./use-courier-delete-flow";
import type {useCourierExport} from "./use-courier-export";
import type {useCourierFlagFlow} from "./use-courier-flag-flow";
import type {useCourierOverlays} from "./use-courier-overlays";
import type {useCourierSuspendFlow} from "./use-courier-suspend-flow";

type OverlayFlows = {
  overlays: ReturnType<typeof useCourierOverlays>;
  flag: ReturnType<typeof useCourierFlagFlow>;
  suspend: ReturnType<typeof useCourierSuspendFlow>;
  del: ReturnType<typeof useCourierDeleteFlow>;
  approve: ReturnType<typeof useCourierApproveFlow>;
};

interface CouriersOverlaysProps extends OverlayFlows {
  suspendReasons: CourierSuspendReason[];
  deleteReasons: CourierDeleteReason[];
  exporting: boolean;
  onExportHistory: ReturnType<typeof useCourierExport>["exportAssignments"];
}

/** Drawer, history modal, doc viewer, mutation dialogs, and the shared toast — above the list. */
export function CouriersOverlays({
  overlays,
  flag,
  suspend,
  del,
  approve,
  suspendReasons,
  deleteReasons,
  exporting,
  onExportHistory,
}: CouriersOverlaysProps) {
  return (
    <>
      <CourierDrawer
        id={overlays.openId}
        open={overlays.openId !== null}
        onClose={overlays.closeDrawer}
        onFlag={(detail) => flag.openFlag(detail.id, detail.name)}
        onSuspend={suspend.openSuspend}
        onDelete={del.openDelete}
        onViewDocument={(detail, item) => overlays.openDoc({detail, item})}
        onApprove={(detail, item) => approve.approve(detail.id, item)}
        onOpenHistory={overlays.openHistory}
      />
      <CourierHistoryModal
        detail={overlays.historyDetail}
        open={overlays.historyDetail !== null}
        exporting={exporting}
        onClose={overlays.closeHistory}
        onExport={(params) => void (overlays.historyDetail && onExportHistory(overlays.historyDetail.id, params))}
      />
      <CourierDocViewer
        target={overlays.docTarget}
        approving={approve.approving}
        onClose={overlays.closeDoc}
        onApprove={() => overlays.docTarget && approve.approve(overlays.docTarget.detail.id, overlays.docTarget.item, overlays.closeDoc)}
      />
      <CourierDialogs
        flag={flag}
        suspend={suspend}
        del={del}
        approve={approve}
        suspendReasons={suspendReasons}
        deleteReasons={deleteReasons}
      />
    </>
  );
}

/** The first active flow's toast wins — flows are mutually exclusive in practice. */
function activeToast(flows: Pick<OverlayFlows, "flag" | "suspend" | "del" | "approve">) {
  const active = [
    {message: flows.flag.toast, dismiss: flows.flag.dismissToast},
    {message: flows.suspend.toast, dismiss: flows.suspend.dismissToast},
    {message: flows.del.toast, dismiss: flows.del.dismissToast},
    {message: flows.approve.toast, dismiss: flows.approve.dismissToast},
  ].find((entry): entry is {message: string; dismiss: () => void} => entry.message !== null);
  return active ?? null;
}

/** The suspend/unsuspend, delete, and flag dialogs plus whichever flow's toast is active. */
function CourierDialogs({
  flag,
  suspend,
  del,
  approve,
  suspendReasons,
  deleteReasons,
}: Omit<CouriersOverlaysProps, "overlays" | "exporting" | "onExportHistory">) {
  const toast = activeToast({flag, suspend, del, approve});
  return (
    <>
      <SuspendCourierDialog
        open={suspend.target !== null}
        intent={suspend.target?.intent ?? "suspend"}
        name={suspend.target?.name ?? ""}
        reasons={suspendReasons}
        submitting={suspend.submitting}
        failed={suspend.failed}
        onClose={suspend.closeSuspend}
        onSubmit={suspend.submit}
      />
      <DeleteCourierDialog
        open={del.detail !== null}
        name={del.detail?.name ?? ""}
        reasons={deleteReasons}
        submitting={del.submitting}
        failed={del.failed}
        onClose={del.closeDelete}
        onConfirm={del.confirm}
      />
      <FlagForReviewDialog
        open={flag.flagIds !== null}
        parcelIds={flag.flagIds ?? []}
        noun="courier"
        description={m["couriers.flag_description"]()}
        submitting={flag.submitting}
        failed={flag.failed}
        onClose={flag.closeFlag}
        onSubmit={flag.submit}
      />
      {toast && <CouriersToast message={toast.message} onDismiss={toast.dismiss} />}
    </>
  );
}
