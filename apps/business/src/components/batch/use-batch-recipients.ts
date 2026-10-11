import {useState} from "react";
import {bulkCostOf} from "@/lib/shipment-pricing";
import type {Locker} from "@/types/shipment-types";
import {emptyRecipient, recipientError, type RecipientDraft} from "@/components/new-shipment/recipient-draft";
import {parseShipmentsCsv} from "./parse-shipments-csv";

export type EntryTab = "csv" | "manual";

const CSV_PROCESSING_MS = 900;

export interface CsvFile {
  name: string;
  sizeKb: number;
  parseError: "empty" | "header" | null;
}

/** Step-2/3 data: recipient drafts (CSV + manual), validation, and bulk cost. */
export function useBatchRecipients(lockers: Locker[]) {
  const [recipients, setRecipients] = useState<RecipientDraft[]>([]);
  const [entryTab, setEntryTab] = useState<EntryTab>("csv");
  const [csvFile, setCsvFile] = useState<CsvFile | null>(null);
  const [processing, setProcessing] = useState(false);

  const errors = recipients
    .map((recipient) => ({recipient, error: recipientError(recipient, lockers)}))
    .filter((row): row is {recipient: RecipientDraft; error: NonNullable<ReturnType<typeof recipientError>>} => row.error !== null);
  const validRows = recipients.filter((recipient) => recipientError(recipient, lockers) === null);
  const cost = bulkCostOf(validRows);

  const patchRecipient = (updated: RecipientDraft) => setRecipients((rows) => rows.map((row) => (row.id === updated.id ? updated : row)));
  const removeRecipient = (id: string) => setRecipients((rows) => rows.filter((row) => row.id !== id));
  const addRecipient = (lockerId: string) => setRecipients((rows) => [...rows, emptyRecipient(lockerId)]);

  function uploadFile(file: File) {
    setProcessing(true);
    void file.text().then((text) => {
      const {recipients: parsed, error} = parseShipmentsCsv(text);
      setTimeout(() => {
        setCsvFile({name: file.name, sizeKb: Math.max(1, Math.round(file.size / 1024)), parseError: error});
        if (error === null) setRecipients((rows) => [...rows, ...parsed]);
        setProcessing(false);
      }, CSV_PROCESSING_MS);
    });
  }

  return {
    recipients,
    entryTab,
    csvFile,
    processing,
    errors,
    validRows,
    cost,
    setEntryTab,
    patchRecipient,
    removeRecipient,
    addRecipient,
    removeFile: () => setCsvFile(null),
    uploadFile,
  };
}

export type BatchRecipients = ReturnType<typeof useBatchRecipients>;
