import {Plus} from "lucide-react";
import {m} from "@/paraglide/messages";
import type {Locker} from "@/types/shipment-types";
import type {RecipientDraft} from "./recipient-draft";
import {RecipientRow} from "./recipient-row";

const HEADERS = [
  m["batch.col_recipient"],
  m["batch.col_phone"],
  m["batch.col_destination"],
  m["batch.col_size"],
  m["batch.col_priority"],
] as const;

interface ShipmentFormProps {
  recipients: RecipientDraft[];
  lockers: Locker[];
  showErrors: boolean;
  onChange: (recipient: RecipientDraft) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
}

/** The card's left column in form mode: section heading, recipients grid, add-row action. */
export function ShipmentForm({recipients, lockers, showErrors, onChange, onRemove, onAdd}: ShipmentFormProps) {
  return (
    <div className="flex w-[728px] shrink-0 flex-col gap-6 border-r-[0.75px] border-grey-300 p-6">
      <div className="flex w-full flex-col items-start gap-1">
        <h2 className="w-full text-lg leading-[1.2] font-medium text-black">{m["batch.single_title"]()}</h2>
        <p className="w-full text-xs leading-[1.4] tracking-[0.12px] text-black opacity-50">{m["batch.form_sub"]()}</p>
      </div>
      <div className="flex w-full flex-col gap-4">
        <div className="grid grid-cols-[1.15fr_1fr_1.25fr_52px_1fr_24px] items-center gap-2 rounded bg-[#f9f9f9] px-2 py-3">
          {HEADERS.map((header) => (
            <p key={header()} className="text-xs leading-[1.4] font-medium tracking-[0.24px] text-black">
              {header()}
            </p>
          ))}
          <span />
        </div>
        {recipients.map((recipient) => (
          <RecipientRow
            key={recipient.id}
            recipient={recipient}
            lockers={lockers}
            showErrors={showErrors}
            onChange={onChange}
            onRemove={() => onRemove(recipient.id)}
          />
        ))}
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 self-start rounded-lg p-1 text-base leading-[1.4] font-medium tracking-[0.32px] text-primary-500 hover:text-primary-700"
        >
          <Plus className="size-4" aria-hidden="true" />
          {m["batch.add_recipient"]()}
        </button>
      </div>
    </div>
  );
}
