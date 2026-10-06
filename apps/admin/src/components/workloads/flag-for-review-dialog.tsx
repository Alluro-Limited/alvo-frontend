import {Dialog, DialogBackdrop, DialogClose, DialogDescription, DialogPopup, DialogPortal, DialogTitle} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import wlClose from "@/assets/wl-close.svg";
import {FlagForm} from "./flag-form";
import type {FlagReason} from "./flag-reasons";

interface FlagForReviewDialogProps {
  open: boolean;
  parcelIds: string[];
  submitting: boolean;
  /** The last flag attempt failed — shows an inline error and keeps the form open. */
  failed: boolean;
  onClose: () => void;
  onSubmit: (reason: FlagReason, notes: string) => void;
}

/** Flag-for-review modal — same dialog for one parcel or a bulk selection. */
export function FlagForReviewDialog({open, parcelIds, submitting, failed, onClose, onSubmit}: FlagForReviewDialogProps) {
  const single = parcelIds.length === 1;
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="w-[500px] max-w-[calc(100vw-32px)] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-xl leading-[1.3] font-semibold text-black">
                {single ? m["workloads.flag_modal_title"]() : m["workloads.flag_modal_multi_title"]({count: parcelIds.length})}
              </DialogTitle>
              {single && (
                <p className="pt-1 text-sm leading-[1.4] tracking-[0.14px] text-grey-500">
                  {m["workloads.flag_subtitle"]({id: parcelIds[0]})}
                </p>
              )}
            </div>
            <DialogClose className="rounded p-0.5 text-grey-600 hover:bg-grey-100" aria-label={m["workloads.close"]()}>
              <img src={wlClose} alt="" className="size-6" aria-hidden="true" />
            </DialogClose>
          </div>
          <DialogDescription className="pt-3 text-grey-600">{m["workloads.flag_modal_description"]()}</DialogDescription>
          <FlagForm submitting={submitting} failed={failed} onCancel={onClose} onSubmit={onSubmit} />
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
