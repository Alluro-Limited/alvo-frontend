import {X} from "lucide-react";
import {m} from "@/paraglide/messages";
import type {Locker} from "@/types/shipment-types";
import {isPhoneValid, type RecipientDraft} from "./recipient-draft";
import {RecipientSelects} from "./recipient-selects";
import {RowInput} from "./row-select";

interface RecipientRowProps {
  recipient: RecipientDraft;
  lockers: Locker[];
  showErrors: boolean;
  onChange: (recipient: RecipientDraft) => void;
  onRemove: () => void;
}

/** One grid row of the recipients table: name, phone, destination, size, priority, remove. */
export function RecipientRow({recipient, lockers, showErrors, onChange, onRemove}: RecipientRowProps) {
  const patch = (part: Partial<RecipientDraft>) => onChange({...recipient, ...part});
  return (
    <div className="grid grid-cols-[1.15fr_1fr_1.25fr_52px_1fr_24px] items-start gap-2">
      <RowInput
        ariaLabel={m["batch.col_recipient"]()}
        invalid={showErrors && recipient.name.trim() === ""}
        value={recipient.name}
        onChange={(event) => patch({name: event.target.value})}
        placeholder={m["batch.recipient_ph"]()}
      />
      <RowInput
        ariaLabel={m["batch.col_phone"]()}
        invalid={showErrors && !isPhoneValid(recipient.phone)}
        value={recipient.phone}
        onChange={(event) => patch({phone: event.target.value})}
        placeholder={m["batch.phone_ph"]()}
        inputMode="tel"
      />
      <RecipientSelects recipient={recipient} lockers={lockers} showErrors={showErrors} onChange={onChange} />
      <button
        type="button"
        onClick={onRemove}
        aria-label={m["batch.remove_recipient"]()}
        className="flex h-[41px] items-center justify-center text-black hover:text-status-fail"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
