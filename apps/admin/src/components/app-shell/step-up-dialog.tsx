import {useState, useSyncExternalStore, type FormEvent} from "react";
import {Button, Dialog, DialogBackdrop, DialogPopup, DialogPortal, DialogTitle, PinInput} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import {cancelStepUp, isStepUpPending, subscribeStepUp, submitStepUpCode} from "@/services/step-up";

interface StepUpFormProps {
  onClose: () => void;
}

function StepUpForm({onClose}: StepUpFormProps) {
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || code.length !== 6) return;
    setSubmitting(true);
    setFailed(false);
    try {
      await submitStepUpCode(code);
      setCode("");
    } catch {
      setFailed(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col items-center gap-5 pt-5">
      <PinInput
        label={m["step_up.code_label"]()}
        length={6}
        variant="box"
        value={code}
        onValueChange={(value) => {
          setCode(value);
          setFailed(false);
        }}
        disabled={submitting}
        invalid={failed}
        autoComplete="one-time-code"
      />
      {failed && <p className="text-sm leading-[1.4] text-status-fail">{m["step_up.error"]()}</p>}
      <div className="flex w-full justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose}>
          {m["step_up.cancel"]()}
        </Button>
        <Button type="submit" isLoading={submitting} disabled={code.length !== 6 || submitting}>
          {submitting ? m["step_up.submitting"]() : m["step_up.submit"]()}
        </Button>
      </div>
    </form>
  );
}

/**
 * High-risk mutations (admin/user deletes, settings writes) need a fresh
 * authenticator code — the API calls it a step-up. Services await a token from
 * `services/step-up`; this dialog is what collects the code.
 */
export function StepUpDialog() {
  const open = useSyncExternalStore(subscribeStepUp, isStepUpPending);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && cancelStepUp()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="w-[420px] max-w-[calc(100vw-32px)] p-6">
          <DialogTitle>{m["step_up.title"]()}</DialogTitle>
          <p className="pt-1 text-sm leading-[1.4] text-grey-600">{m["step_up.description"]()}</p>
          <StepUpForm onClose={cancelStepUp} />
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
