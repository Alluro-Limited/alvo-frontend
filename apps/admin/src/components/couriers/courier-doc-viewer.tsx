import {Button, Dialog, DialogBackdrop, DialogClose, DialogPopup, DialogPortal, DialogTitle} from "@alvo/ui";
import {Check, Download, Info} from "lucide-react";
import {m} from "@/paraglide/messages";
import wlClose from "@/assets/wl-close.svg";
import type {CourierDetail, CourierVerificationItem} from "@/types/couriers-types";
import {VERIFICATION_ITEM_LABELS} from "./courier-labels";
import {CourierPngBadge} from "./courier-png-badge";

export interface DocTarget {
  detail: CourierDetail;
  item: CourierVerificationItem;
}

interface CourierDocViewerProps {
  /** The verification item whose document is being previewed — null closes the viewer. */
  target: DocTarget | null;
  approving: boolean;
  onClose: () => void;
  onApprove: () => void;
}

/** Document preview modal — PNG badge, courier name, Download and Approve actions, signup note footer. */
export function CourierDocViewer({target, approving, onClose, onApprove}: CourierDocViewerProps) {
  const item = target?.item ?? null;
  const approved = item?.status === "approved";
  return (
    <Dialog open={target !== null} onOpenChange={(next) => !next && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="w-[720px] max-w-[calc(100vw-32px)] p-0">
          {target !== null && item !== null && (
            <>
              <ViewerHeader target={target} approved={approved} approving={approving} onApprove={onApprove} />
              <div className="flex h-[480px] items-center justify-center bg-grey-100 p-8">
                <div className="flex h-full w-full max-w-[420px] flex-col items-center justify-center gap-4 rounded-lg bg-white shadow-sm">
                  <CourierPngBadge className="size-16 text-sm" />
                  {item.fileName && <p className="text-sm font-medium tracking-[0.14px] text-grey-800">{item.fileName}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2 border-t border-grey-200 px-6 py-3 text-sm leading-[1.4] tracking-[0.14px] text-grey-600">
                <Info className="size-4 shrink-0" aria-hidden="true" />
                {m["couriers.doc_note"]()}
              </div>
            </>
          )}
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}

/** Title + courier name on the left; Download, Approve, and close on the right. */
function ViewerHeader({
  target,
  approved,
  approving,
  onApprove,
}: {
  target: DocTarget;
  approved: boolean;
  approving: boolean;
  onApprove: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-grey-200 px-6 py-4">
      <div className="flex items-center gap-3">
        <CourierPngBadge className="size-8" />
        <div>
          <DialogTitle className="text-base leading-[1.4] font-semibold text-black">
            {VERIFICATION_ITEM_LABELS[target.item.key]()}
          </DialogTitle>
          <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{target.detail.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            // Mock download: the backend file URL doesn't exist yet.
          }}
        >
          <Download className="size-4" aria-hidden="true" />
          {m["couriers.doc_download"]()}
        </Button>
        {!approved && (
          <Button type="button" variant="outline" isLoading={approving} onClick={onApprove}>
            <Check className="size-4" aria-hidden="true" />
            {m["couriers.doc_approve"]()}
          </Button>
        )}
        <DialogClose className="rounded p-0.5 text-grey-600 hover:bg-grey-100" aria-label={m["workloads.close"]()}>
          <img src={wlClose} alt="" className="size-6" aria-hidden="true" />
        </DialogClose>
      </div>
    </div>
  );
}
