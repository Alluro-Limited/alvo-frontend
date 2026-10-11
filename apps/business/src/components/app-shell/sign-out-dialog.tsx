import {useNavigate} from "@tanstack/react-router";
import {LogOut} from "lucide-react";
import {Dialog, DialogBackdrop, DialogPopup, DialogPortal} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import {useSignOutMutation} from "@/queries/use-login-mutation";

/** Confirmation modal behind the sidebar Logout — matches the 396px centered Figma dialog. */
export function SignOutDialog({open, onClose}: {open: boolean; onClose: () => void}) {
  const navigate = useNavigate();
  const mutation = useSignOutMutation();

  const confirm = () => mutation.mutate(undefined, {onSuccess: () => void navigate({to: "/"})});

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? undefined : onClose())}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="flex w-[396px] flex-col items-center gap-8 rounded-2xl bg-white p-6">
          <div className="flex w-full flex-col items-center gap-6">
            <div className="flex size-16 items-center justify-center rounded-full bg-status-fail-subtle">
              <LogOut className="size-8 text-status-fail" strokeWidth={1.5} aria-hidden="true" />
            </div>
            <div className="flex w-full flex-col items-center gap-2 text-center">
              <h2 className="w-full text-xl leading-[1.2] font-medium text-black">{m["signout.title"]()}</h2>
              <p className="w-full text-sm leading-[1.4] tracking-[0.14px] text-grey-600 opacity-70">{m["signout.subtitle"]()}</p>
            </div>
          </div>
          <div className="flex w-full gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex h-[50px] flex-1 items-center justify-center rounded-lg border-[0.75px] border-grey-600 px-5 py-3.5 text-base leading-[1.4] font-medium tracking-[0.32px] text-grey-500 hover:bg-grey-100"
            >
              {m["pay.cancel"]()}
            </button>
            <button
              type="button"
              onClick={confirm}
              disabled={mutation.isPending}
              className="flex h-[50px] flex-1 items-center justify-center rounded-lg bg-button-danger px-5 py-3.5 text-base leading-[1.4] font-medium tracking-[0.32px] text-button-danger-foreground enabled:hover:opacity-90 disabled:opacity-60"
            >
              {mutation.isPending ? m["signout.working"]() : m["signout.confirm"]()}
            </button>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
