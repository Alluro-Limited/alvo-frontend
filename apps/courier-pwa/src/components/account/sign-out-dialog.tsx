import {useNavigate} from "@tanstack/react-router";
import {LogOut} from "lucide-react";
import {Dialog, DialogBackdrop, DialogPopup, DialogPortal} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import {useSignOutMutation} from "@/queries/use-earnings-queries";

interface SignOutDialogProps {
  open: boolean;
  onClose: () => void;
}

/** The centered "Signing out?" alert — pink icon tile, red Sign Out + grey Stay signed in. */
export function SignOutDialog({open, onClose}: SignOutDialogProps) {
  const navigate = useNavigate();
  const signOut = useSignOutMutation();

  const confirm = () => {
    signOut.mutate(undefined, {onSuccess: () => void navigate({to: "/sign-in"})});
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="w-[342px] max-w-[calc(100vw-48px)] px-[18px] py-8">
          <div className="flex flex-col items-center">
            <span className="grid size-12 place-items-center rounded-[14px] bg-status-fail-subtle">
              <LogOut className="size-6 text-status-fail" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-center text-[18px] font-bold">{m["so.title"]()}</h2>
            <p className="mt-1.5 text-center text-[16px] leading-[22px] text-black/60">{m["so.desc"]()}</p>
          </div>
          <div className="mt-8 flex flex-col gap-2">
            <button
              type="button"
              onClick={confirm}
              disabled={signOut.isPending}
              className="h-[50px] w-full rounded-[8px] bg-status-fail text-[16px] font-medium text-status-fail-subtle disabled:opacity-60"
            >
              {signOut.isPending ? m["so.signing_out"]() : m["so.confirm"]()}
            </button>
            <button type="button" onClick={onClose} className="h-[50px] w-full rounded-[8px] bg-grey-200 text-[16px] font-medium">
              {m["so.stay"]()}
            </button>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
