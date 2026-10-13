import {useNavigate} from "@tanstack/react-router";
import {BadgeCheck} from "lucide-react";
import {Dialog, DialogBackdrop, DialogPopup, DialogPortal} from "@alvo/ui";
import {m} from "@/paraglide/messages";

interface CompleteSheetProps {
  jobId: string;
  payout: number;
  open: boolean;
  onClose: () => void;
}

/** Bottom sheet after "Dropped Off" confirms: badge, earnings line, Back to Home / View Details. */
export function CompleteSheet({jobId, payout, open, onClose}: CompleteSheetProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="top-auto bottom-0 left-0 w-full max-w-none translate-x-0 translate-y-0 rounded-t-[24px] rounded-b-none px-6 pt-8 pb-[max(32px,env(safe-area-inset-bottom))]">
          <div className="flex justify-center">
            <BadgeCheck className="size-20 text-primary-500" strokeWidth={1.5} aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-center text-[24px] font-bold tracking-[-0.01em]">{m["job.done_title"]()}</h2>
          <p className="mt-2 text-center text-[14px] leading-[22px] text-grey-600">{`${jobId} ${m["job.done_desc"]()}`}</p>
          <div className="mt-5 rounded-[12px] bg-grey-100 py-4 text-center">
            <p className="text-[12px] text-grey-500">{m["job.fixed_pay"]()}</p>
            <p className="mt-1 text-[28px] font-bold text-primary-500">₦{payout.toLocaleString("en-US")}</p>
          </div>
          <div className="mt-6 flex items-center justify-between gap-3">
            <button type="button" onClick={() => void navigate({to: "/home"})} className="h-[50px] flex-1 text-[16px] font-semibold">
              {m["job.back_home"]()}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-[50px] flex-1 rounded-[10px] bg-primary-500 text-[16px] font-semibold text-white"
            >
              {m["home.view_details"]()}
            </button>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
