import type {Locker, ShipmentRecipient} from "@/types/shipment-types";

export type RecipientErrorCode = "name" | "phone" | "locker";

/** A form row: the recipient payload plus a stable local id; `csvRow` tracks the source line for CSV imports. */
export interface RecipientDraft extends ShipmentRecipient {
  id: string;
  csvRow?: number;
}

export function emptyRecipient(lockerId = ""): RecipientDraft {
  return {id: crypto.randomUUID(), name: "", phone: "", lockerId, size: "S", priority: "standard"};
}

/** Local-format digits: a leading "234" country code is dropped. */
export function phoneDigits(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("234") && digits.length === 13 ? digits.slice(3) : digits;
}

export function isPhoneValid(phone: string) {
  return phoneDigits(phone).length === 11;
}

/** First blocking validation issue on a row, or null when the row is shippable. */
export function recipientError(recipient: RecipientDraft, lockers: Locker[]): {code: RecipientErrorCode; detail?: string} | null {
  if (recipient.name.trim() === "") return {code: "name"};
  if (!isPhoneValid(recipient.phone)) return {code: "phone"};
  if (!lockers.some((locker) => locker.id === recipient.lockerId)) return {code: "locker", detail: recipient.lockerId};
  return null;
}

export function isRecipientValid(recipient: RecipientDraft, lockers: Locker[]) {
  return recipientError(recipient, lockers) === null;
}

export function lockerName(lockers: Locker[], lockerId: string) {
  return lockers.find((locker) => locker.id === lockerId)?.name ?? "";
}
