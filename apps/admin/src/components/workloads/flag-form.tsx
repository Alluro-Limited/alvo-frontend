import {useState} from "react";
import {Button} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import {FLAG_REASONS, flagReasonLabel, type FlagReason} from "./flag-reasons";
import {SelectShell} from "./select-shell";

interface FlagFormProps {
  submitting: boolean;
  failed: boolean;
  onCancel: () => void;
  onSubmit: (reason: FlagReason, notes: string) => void;
}

/** Reason + optional-notes form body of the flag-for-review dialog. */
export function FlagForm({submitting, failed, onCancel, onSubmit}: FlagFormProps) {
  const [reason, setReason] = useState<FlagReason | "">("");
  const [notes, setNotes] = useState("");
  const canSubmit = reason !== "" && !submitting;

  return (
    <form
      noValidate
      className="pt-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (reason && canSubmit) onSubmit(reason, notes.trim());
      }}
    >
      <label className="block text-sm leading-[1.4] font-medium tracking-[0.14px] text-black" htmlFor="flag-reason">
        {m["workloads.flag_reason_label"]()}
      </label>
      <SelectShell id="flag-reason" value={reason} onChange={(v) => setReason(v as FlagReason | "")} wrapperClassName="mt-2">
        <option value="" disabled>
          {m["workloads.flag_reason_placeholder"]()}
        </option>
        {FLAG_REASONS.map((value) => (
          <option key={value} value={value}>
            {flagReasonLabel(value)}
          </option>
        ))}
      </SelectShell>
      <label className="mt-4 block text-sm leading-[1.4] font-medium tracking-[0.14px] text-black" htmlFor="flag-notes">
        {m["workloads.flag_notes_label"]()}
      </label>
      <textarea
        id="flag-notes"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder={m["workloads.flag_notes_placeholder"]()}
        rows={4}
        className="mt-2 w-full resize-none rounded-lg border-[0.75px] border-grey-300 px-4 py-3 text-sm leading-[1.4] tracking-[0.14px] text-grey-600 outline-none placeholder:text-grey-500 focus:border-primary-500"
      />
      <p className="pt-2 text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{m["workloads.flag_note"]()}</p>
      {failed && <p className="pt-3 text-sm text-status-fail">{m["workloads.flag_error"]()}</p>}
      <FlagActions submitting={submitting} canSubmit={canSubmit} onCancel={onCancel} />
    </form>
  );
}

function FlagActions({submitting, canSubmit, onCancel}: {submitting: boolean; canSubmit: boolean; onCancel: () => void}) {
  return (
    <div className="mt-6 flex justify-end gap-3">
      <Button type="button" variant="outline" onClick={onCancel}>
        {m["workloads.flag_cancel"]()}
      </Button>
      <Button type="submit" variant={canSubmit ? "default" : "disabled"}>
        {submitting ? m["workloads.flag_confirm_loading"]() : m["workloads.flag_confirm"]()}
      </Button>
    </div>
  );
}
