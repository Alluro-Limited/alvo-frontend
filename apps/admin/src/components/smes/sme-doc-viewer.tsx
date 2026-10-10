import {Button, Dialog, DialogBackdrop, DialogClose, DialogPopup, DialogPortal, DialogTitle} from "@alvo/ui";
import {Download} from "lucide-react";
import {m} from "@/paraglide/messages";
import smePdfBadge from "@/assets/sme-pdf-badge.svg";
import wlClose from "@/assets/wl-close.svg";
import type {SmeVerificationItem} from "@/types/smes-types";

interface SmeDocViewerProps {
  /** The verification item whose document is being previewed — null closes the viewer. */
  item: SmeVerificationItem | null;
  onClose: () => void;
  onApprove: () => void;
}

/** Full-width document preview modal — header actions: Download and Approve. */
export function SmeDocViewer({item, onClose, onApprove}: SmeDocViewerProps) {
  return (
    <Dialog open={item !== null} onOpenChange={(next) => !next && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="w-[720px] max-w-[calc(100vw-32px)] p-0">
          {item !== null && (
            <>
              <div className="flex items-center justify-between gap-4 border-b border-grey-200 px-6 py-4">
                <DialogTitle className="text-lg leading-[1.3] font-semibold text-black">{item.label}</DialogTitle>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      // Mock download: the backend file URL doesn't exist yet.
                    }}
                  >
                    <Download className="size-4" aria-hidden="true" />
                    {m["smes.doc_download"]()}
                  </Button>
                  <Button type="button" onClick={onApprove}>
                    {m["smes.doc_approve"]()}
                  </Button>
                  <DialogClose className="rounded p-0.5 text-grey-600 hover:bg-grey-100" aria-label={m["workloads.close"]()}>
                    <img src={wlClose} alt="" className="size-6" aria-hidden="true" />
                  </DialogClose>
                </div>
              </div>
              <div className="flex h-[560px] items-center justify-center bg-grey-100 p-8">
                <div className="flex h-full w-full max-w-[420px] flex-col items-center justify-center gap-4 rounded-lg bg-white shadow-sm">
                  <img src={smePdfBadge} alt="" className="size-16" aria-hidden="true" />
                  {item.fileName && <p className="text-sm font-medium tracking-[0.14px] text-grey-800">{item.fileName}</p>}
                  <p className="max-w-[280px] text-center text-xs leading-[1.5] tracking-[0.12px] text-grey-500">{m["smes.doc_note"]()}</p>
                </div>
              </div>
            </>
          )}
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
