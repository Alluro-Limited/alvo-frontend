import {useState} from "react";
import {useLockersQuery} from "@/queries/use-shipment-queries";
import {priceForShipment} from "@/lib/shipment-pricing";
import {emptyRecipient, isRecipientValid, type RecipientDraft} from "./recipient-draft";

/** Recipient row drafts plus their derived totals and validity for the form stage. */
export function useRecipientRows() {
  const {data: lockers = []} = useLockersQuery();
  const [recipients, setRecipients] = useState<RecipientDraft[]>([]);
  const [showErrors, setShowErrors] = useState(false);

  /** Falls back to the first locker so rows look preselected like the design. */
  const effectiveRecipients = recipients.map((recipient) =>
    recipient.lockerId === "" && lockers.length > 0 ? {...recipient, lockerId: lockers[0].id} : recipient
  );
  const total = effectiveRecipients.reduce((sum, recipient) => sum + priceForShipment(recipient.size, recipient.priority), 0);
  const allValid = effectiveRecipients.length > 0 && effectiveRecipients.every((recipient) => isRecipientValid(recipient, lockers));

  const patchRecipient = (updated: RecipientDraft) => setRecipients((rows) => rows.map((row) => (row.id === updated.id ? updated : row)));
  const removeRecipient = (id: string) => setRecipients((rows) => rows.filter((row) => row.id !== id));
  const addRecipient = () => setRecipients((rows) => [...rows, emptyRecipient()]);
  const startRows = () => setRecipients((rows) => (rows.length > 0 ? rows : [emptyRecipient()]));
  const markErrors = () => setShowErrors(true);
  const clearRows = () => {
    setRecipients([]);
    setShowErrors(false);
  };

  return {
    lockers,
    recipients: effectiveRecipients,
    showErrors,
    total,
    allValid,
    patchRecipient,
    removeRecipient,
    addRecipient,
    startRows,
    markErrors,
    clearRows,
  };
}

export type RecipientRows = ReturnType<typeof useRecipientRows>;
