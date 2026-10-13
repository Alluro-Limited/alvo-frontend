import {useState} from "react";
import {useNavigate} from "@tanstack/react-router";
import {Button, Checkbox, Dialog, DialogBackdrop, DialogPopup, DialogPortal, DialogTitle} from "@alvo/ui";
import {TermsCard} from "./terms-card";
import {m} from "@/paraglide/messages";
import iconTermsUrl from "@/assets/icon-terms.svg";

interface SendTermsDialogProps {
  open: boolean;
  /** Flow to enter after agreement — Send Securely or Safe Storage. */
  to: "/send" | "/safe";
  onClose: () => void;
}

/** Centered "Storage & Pickup Terms" consent dialog shown before entering the Send/Safe flows. */
export function SendTermsDialog({open, to, onClose}: SendTermsDialogProps) {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const close = () => {
    setAgreed(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="w-[342px] rounded-[26px] px-[18px] pt-8 pb-[18px]">
          <div className="flex w-full flex-col items-center gap-6">
            <img src={iconTermsUrl} alt="" aria-hidden="true" className="size-16" />
            <div className="flex w-full flex-col gap-6">
              <div className="flex w-full flex-col gap-1.5 text-center">
                <DialogTitle className="text-[20px] font-bold leading-[1.2] text-[#070d17]">{m["send.terms_title"]()}</DialogTitle>
                <p className="text-[12px] leading-[1.4] tracking-[0.12px] text-[#070d17] opacity-60">{m["send.terms_desc"]()}</p>
              </div>
              <TermsCard />
            </div>
            <div className="flex w-full flex-col gap-6">
              <div className="flex w-full items-center gap-2">
                <Checkbox checked={agreed} onCheckedChange={(c) => setAgreed(c === true)} aria-label={m["send.agree"]()} />
                <span className="flex-1 text-[12px] leading-[1.4] tracking-[0.12px] text-primary-850">{m["send.agree"]()}</span>
              </div>
              <Button
                className="w-full text-[16px] font-medium"
                variant={agreed ? "default" : "disabled"}
                onClick={() => {
                  close();
                  void navigate({to});
                }}
              >
                {m["send.agree_continue"]()}
              </Button>
            </div>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
