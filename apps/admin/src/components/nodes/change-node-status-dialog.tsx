import {Dialog, DialogBackdrop, DialogClose, DialogPopup, DialogPortal, DialogTitle} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import wlClose from "@/assets/wl-close.svg";
import type {ChangeNodeStatusInput, NodeDetail, NodeStatus} from "@/types/nodes-types";
import {StatusForm} from "./status-form";

interface ChangeNodeStatusDialogProps {
  node: NodeDetail;
  /** Preselected target — Schedule Maintenance opens the dialog aimed at "maintenance". */
  initialStatus?: NodeStatus;
  submitting: boolean;
  failed: boolean;
  onClose: () => void;
  onSubmit: (input: ChangeNodeStatusInput) => void;
}

/** Change-status modal — title, subtitle, then the target/reason/notes form. */
export function ChangeNodeStatusDialog({node, initialStatus, submitting, failed, onClose, onSubmit}: ChangeNodeStatusDialogProps) {
  return (
    <Dialog open onOpenChange={(next) => !next && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="max-h-[calc(100vh-64px)] w-[500px] max-w-[calc(100vw-32px)] overflow-y-auto p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-xl leading-[1.3] font-semibold text-black">{m["nodes.status_dialog_title"]()}</DialogTitle>
              <p className="pt-1 text-sm leading-[1.4] tracking-[0.14px] text-grey-500">
                {m["nodes.status_dialog_subtitle"]({code: node.code, name: node.name})}
              </p>
            </div>
            <DialogClose className="rounded p-0.5 text-grey-600 hover:bg-grey-100" aria-label={m["workloads.close"]()}>
              <img src={wlClose} alt="" className="size-6" aria-hidden="true" />
            </DialogClose>
          </div>
          <StatusForm
            node={node}
            initialStatus={initialStatus}
            submitting={submitting}
            failed={failed}
            onCancel={onClose}
            onSubmit={onSubmit}
          />
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
