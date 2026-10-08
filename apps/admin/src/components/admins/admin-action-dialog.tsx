import {Button, Dialog, DialogBackdrop, DialogDescription, DialogPopup, DialogPortal, DialogTitle} from "@alvo/ui";
import {m} from "@/paraglide/messages";

export type AdminActionKind = "suspend" | "reactivate" | "delete";

const COPY: Record<
  AdminActionKind,
  {title: () => string; description: () => string; confirm: () => string; confirming: () => string; destructive: boolean}
> = {
  suspend: {
    title: m["admins.suspend_title"],
    description: m["admins.suspend_description"],
    confirm: m["admins.suspend_confirm"],
    confirming: m["admins.suspend_confirming"],
    destructive: true,
  },
  reactivate: {
    title: m["admins.reactivate_title"],
    description: m["admins.reactivate_description"],
    confirm: m["admins.reactivate_confirm"],
    confirming: m["admins.reactivate_confirming"],
    destructive: false,
  },
  delete: {
    title: m["admins.delete_title"],
    description: m["admins.delete_description"],
    confirm: m["admins.delete_confirm"],
    confirming: m["admins.delete_confirming"],
    destructive: true,
  },
};

interface AdminActionDialogProps {
  kind: AdminActionKind | null;
  submitting: boolean;
  failed: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/** Shared confirmation dialog for suspend / reactivate / delete — copy varies by kind. */
export function AdminActionDialog({kind, submitting, failed, onClose, onConfirm}: AdminActionDialogProps) {
  const copy = kind !== null ? COPY[kind] : null;
  return (
    <Dialog open={kind !== null} onOpenChange={(next) => !next && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="w-[440px] max-w-[calc(100vw-32px)] p-6">
          {copy !== null && (
            <>
              <DialogTitle className="text-xl leading-[1.3] font-semibold text-black">{copy.title()}</DialogTitle>
              <DialogDescription className="pt-3 text-sm leading-[1.4] tracking-[0.14px] text-grey-600">
                {copy.description()}
              </DialogDescription>
              {failed && <p className="pt-3 text-sm leading-[1.4] tracking-[0.14px] text-status-fail">{m["admins.action_error"]()}</p>}
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={onClose} disabled={submitting}>
                  {m["admins.cancel"]()}
                </Button>
                <Button variant={copy.destructive ? "destructive" : "default"} isLoading={submitting} onClick={onConfirm}>
                  {submitting ? copy.confirming() : copy.confirm()}
                </Button>
              </div>
            </>
          )}
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
