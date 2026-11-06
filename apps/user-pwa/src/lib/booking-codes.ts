/**
 * The API returns a parcel's drop-off code exactly once (booking, or a drop-off window
 * change) and stores it hashed — it can't be fetched again. The Access view needs it
 * later, so booking-time codes are kept in localStorage keyed by parcel id.
 */

const STORAGE_KEY = "alvo.user-pwa.dropoff-codes";

function read(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<string, string>;
  } catch {
    return {};
  }
}

export function saveDropoffCode(parcelId: string, code: string): void {
  const all = read();
  all[parcelId] = code;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function getDropoffCode(parcelId: string): string {
  return read()[parcelId] ?? "";
}
