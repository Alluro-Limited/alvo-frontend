import {useState} from "react";
import {Button, Dialog, DialogBackdrop, DialogDescription, DialogPopup, DialogPortal, DialogTitle} from "@alvo/ui";
import {HTTPError} from "ky";
import {m} from "@/paraglide/messages";
import type {ChangePasswordInput} from "@/types/profile-types";
import {ADMIN_INPUT, ADMIN_LABEL} from "@/components/admins/admin-info-fields";

interface ChangePasswordDialogProps {
  open: boolean;
  submitting: boolean;
  /** The last submit failed — server-rejected current password vs. a generic failure. */
  error: "wrong_password" | "generic" | null;
  onClose: () => void;
  onSubmit: (input: ChangePasswordInput) => void;
}

/** The Reset Password dialog — current password verification plus the new/confirm pair. */
export function ChangePasswordDialog({open, submitting, error, onClose, onSubmit}: ChangePasswordDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="w-[480px] max-w-[calc(100vw-32px)] p-6">
          {open && <PasswordForm submitting={submitting} error={error} onSubmit={onSubmit} />}
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}

function PasswordForm({submitting, error, onSubmit}: Pick<ChangePasswordDialogProps, "submitting" | "error" | "onSubmit">) {
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const mismatch = confirm !== "" && confirm !== newPassword;
  const tooShort = newPassword !== "" && newPassword.length < 8;

  return (
    <>
      <DialogTitle className="text-xl leading-[1.3] font-semibold text-black">{m["profile.reset_title"]()}</DialogTitle>
      <DialogDescription className="pt-2 text-sm leading-[1.4] tracking-[0.14px] text-grey-500">
        {m["profile.reset_subtitle"]()}
      </DialogDescription>
      <form
        noValidate
        className="flex flex-col gap-4 pt-5"
        onSubmit={(event) => {
          event.preventDefault();
          if (!submitting && !mismatch && !tooShort && currentPassword !== "" && newPassword !== "") {
            onSubmit({currentPassword, newPassword});
          }
        }}
      >
        <PasswordField id="pw-current" label={m["profile.current_password"]()} value={currentPassword} onChange={setCurrent} />
        <PasswordField id="pw-new" label={m["profile.new_password"]()} value={newPassword} onChange={setNext} />
        <PasswordField id="pw-confirm" label={m["profile.confirm_password"]()} value={confirm} onChange={setConfirm} />
        {tooShort && <p className="text-sm leading-[1.4] tracking-[0.14px] text-status-fail">{m["profile.password_short"]()}</p>}
        {mismatch && <p className="text-sm leading-[1.4] tracking-[0.14px] text-status-fail">{m["profile.password_mismatch"]()}</p>}
        {error === "wrong_password" && (
          <p className="text-sm leading-[1.4] tracking-[0.14px] text-status-fail">{m["profile.password_wrong"]()}</p>
        )}
        {error === "generic" && <p className="text-sm leading-[1.4] tracking-[0.14px] text-status-fail">{m["profile.reset_error"]()}</p>}
        <div className="mt-1 flex justify-end gap-3">
          <Button type="submit" isLoading={submitting} className="w-full">
            {submitting ? m["profile.reset_submitting"]() : m["profile.reset_submit"]()}
          </Button>
        </div>
      </form>
    </>
  );
}

function PasswordField({id, label, value, onChange}: {id: string; label: string; value: string; onChange: (v: string) => void}) {
  return (
    <div>
      <label className={ADMIN_LABEL} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type="password"
        value={value}
        placeholder={m["profile.password_placeholder"]()}
        onChange={(event) => onChange(event.target.value)}
        className={ADMIN_INPUT}
      />
    </div>
  );
}

/** Maps a mutation failure to the dialog's error copy — the API returns 400 for a wrong current password. */
export function passwordErrorKind(error: Error): "wrong_password" | "generic" {
  if (error instanceof HTTPError && error.response.status === 400) return "wrong_password";
  return "generic";
}
