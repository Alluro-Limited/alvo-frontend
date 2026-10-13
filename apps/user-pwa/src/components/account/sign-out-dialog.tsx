import {useNavigate} from "@tanstack/react-router";
import {Trash2} from "lucide-react";
import {Dialog, DialogBackdrop, DialogPopup, DialogPortal, DialogTitle} from "@alvo/ui";
import {m} from "@/paraglide/messages";

/** Centered "Signing out?" confirmation — Sign Out returns to the sign-in screen. */
export function SignOutDialog({onClose}: {onClose: () => void}) {
  const navigate = useNavigate();

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="w-[342px] rounded-[26px] p-6">
          <div className="flex w-full flex-col items-center gap-6">
            <span className="flex size-[52px] items-center justify-center rounded-full bg-status-fail-subtle">
              <Trash2 className="size-6 text-status-fail" aria-hidden="true" />
            </span>
            <div className="flex w-full flex-col gap-2 text-center">
              <DialogTitle className="text-[20px] font-bold leading-[1.2] text-foreground">{m["out.title"]()}</DialogTitle>
              <p className="text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">{m["out.desc"]()}</p>
            </div>
            <div className="flex w-full flex-col gap-3">
              <button
                type="button"
                onClick={() => void navigate({to: "/sign-in"})}
                className="flex h-[50px] w-full items-center justify-center rounded-[12px] bg-status-fail text-[16px] font-medium leading-[1.4] text-white"
              >
                {m["out.confirm"]()}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex h-[50px] w-full items-center justify-center rounded-[12px] bg-[#f2f2f2] text-[16px] font-medium leading-[1.4] text-foreground"
              >
                {m["out.stay"]()}
              </button>
            </div>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
