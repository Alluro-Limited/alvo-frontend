import {Button, Dialog, DialogBackdrop, DialogPopup, DialogPortal} from "@alvo/ui";
import type {SignUpDetails} from "@/types/auth-types";
import {m} from "@/paraglide/messages";

interface ConfirmDetailsProps {
  open: boolean;
  details: SignUpDetails;
  busy: boolean;
  onEdit: () => void;
  onConfirm: () => void;
}

/** Centered modal reviewing phone + email before the verification code is sent. */
export function ConfirmDetails({open, details, busy, onEdit, onConfirm}: ConfirmDetailsProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onEdit()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="w-[calc(100%-48px)] max-w-[360px] rounded-[26px] px-[18px] pt-8 pb-[18px]">
          <div className="flex w-full flex-col gap-4">
            <div className="flex w-full flex-col gap-1.5 text-center">
              <h2 className="text-[24px] font-bold leading-[1.2] tracking-[-0.24px] text-primary-900">{m["su.confirm_title"]()}</h2>
              <p className="text-[16px] leading-[1.4] tracking-[0.16px] text-foreground/60">{m["su.confirm_desc"]()}</p>
            </div>
            <div className="flex w-full flex-col gap-3 rounded-[12px] bg-grey-100 py-4">
              <div className="flex w-full flex-col gap-1 border-b-[0.5px] border-grey-300 px-4 pb-3">
                <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-600">{m["su.confirm_phone"]()}</span>
                <span className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-foreground">0{details.phone}</span>
              </div>
              <div className="flex w-full flex-col gap-1 px-4">
                <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-600">{m["su.confirm_email"]()}</span>
                <span className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-foreground">{details.email}</span>
              </div>
            </div>
          </div>
          <div className="mt-8 flex w-full items-center gap-2">
            <button
              type="button"
              onClick={onEdit}
              className="h-[50px] flex-1 rounded-[8px] bg-[#f2f2f2] px-5 py-3.5 text-[16px] font-medium leading-[1.4] tracking-[0.32px] text-foreground"
            >
              {m["su.edit"]()}
            </button>
            <Button className="h-[50px] flex-1 text-[16px] font-medium" isLoading={busy} onClick={onConfirm}>
              {busy ? m["su.sending"]() : m["su.continue"]()}
            </Button>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
