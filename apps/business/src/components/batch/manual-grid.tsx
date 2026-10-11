import {Plus} from "lucide-react";
import {m} from "@/paraglide/messages";
import {RecipientRow} from "@/components/new-shipment/recipient-row";
import type {useBatchWizard} from "./use-batch-wizard";

const HEADERS = [
  m["batch.col_recipient"],
  m["batch.col_phone"],
  m["batch.col_destination"],
  m["batch.col_size"],
  m["batch.col_priority"],
] as const;

/** The "Manual entry" tab: the same recipient grid as the single-shipment form. */
export function ManualGrid({wizard}: {wizard: ReturnType<typeof useBatchWizard>}) {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="grid grid-cols-[1.15fr_1fr_1.25fr_52px_1fr_24px] items-center gap-2 rounded bg-[#f9f9f9] px-2 py-3">
        {HEADERS.map((header) => (
          <p key={header()} className="text-xs leading-[1.4] font-medium tracking-[0.24px] text-black">
            {header()}
          </p>
        ))}
        <span />
      </div>
      {wizard.recipients.recipients.map((recipient) => (
        <RecipientRow
          key={recipient.id}
          recipient={recipient}
          lockers={wizard.lockers}
          showErrors
          onChange={wizard.recipients.patchRecipient}
          onRemove={() => wizard.recipients.removeRecipient(recipient.id)}
        />
      ))}
      <button
        type="button"
        onClick={() => wizard.recipients.addRecipient(wizard.details.origin)}
        className="flex items-center gap-2 self-start rounded-lg p-1 text-base leading-[1.4] font-medium tracking-[0.32px] text-primary-500 hover:text-primary-700"
      >
        <Plus className="size-4" aria-hidden="true" />
        {m["batch.add_recipient"]()}
      </button>
    </div>
  );
}
