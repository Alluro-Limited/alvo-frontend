import {m} from "@/paraglide/messages";
import {downloadTextFile} from "@/lib/download-text-file";
import type {CreateBatchResult, Locker} from "@/types/shipment-types";
import {lockerName, type RecipientDraft} from "./recipient-draft";

/** Placeholder label download until the backend serves real PDF labels. */
export function downloadBatchLabels(result: CreateBatchResult | null, recipients: RecipientDraft[], lockers: Locker[]) {
  const lines = recipients.map(
    (recipient, index) =>
      `${index + 1}. ${recipient.name} — ${recipient.phone} — ${lockerName(lockers, recipient.lockerId)} — ${recipient.size} — ${recipient.priority}`
  );
  downloadTextFile(`${result?.batchId ?? "batch"}-labels.txt`, [m["success.download_labels"](), "", ...lines].join("\n"));
}

/** Placeholder receipt download until the backend serves a real PDF receipt. */
export function downloadBatchReceipt(result: CreateBatchResult) {
  downloadTextFile(
    `${result.batchId}-receipt.txt`,
    [m["success.shipment_id"]({id: result.batchId}), `Total: ₦${result.totalPaid}`, `To: ${result.receiptEmail}`].join("\n")
  );
}
