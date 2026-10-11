import {Dialog, DialogBackdrop, DialogPopup, DialogPortal} from "@alvo/ui";
import {FileSpreadsheet} from "lucide-react";
import {m} from "@/paraglide/messages";

/** Blocking modal shown while an uploaded CSV is parsed and validated. */
export function ProcessingModal({open}: {open: boolean}) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="flex w-[280px] flex-col items-center gap-4 p-8">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-success-50">
            <FileSpreadsheet className="size-8 text-success-600" aria-hidden="true" />
          </span>
          <span className="flex gap-1.5" aria-hidden="true">
            {[0, 1, 2].map((dot) => (
              <span key={dot} className="size-2 animate-bounce rounded-full bg-grey-400" style={{animationDelay: `${dot * 150}ms`}} />
            ))}
          </span>
          <span className="flex flex-col items-center gap-1 text-center">
            <span className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{m["wiz.processing"]()}</span>
            <span className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{m["wiz.processing_sub"]()}</span>
          </span>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
