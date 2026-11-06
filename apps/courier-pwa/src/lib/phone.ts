/**
 * Nigerian local digits → E.164 for the API (`^\+[1-9]\d{6,14}$`):
 * "08012345678" / "8012345678" / "2348012345678" → "+2348012345678".
 */
export function toE164(national: string): string {
  const digits = national.replace(/\D/g, "");
  const local = digits.startsWith("234") ? digits.slice(3) : digits.startsWith("0") ? digits.slice(1) : digits;
  return `+234${local}`;
}

/** "+2348012345678" → "8012345678" — back to the national digits the fields store. */
export function fromE164(e164: string): string {
  const digits = e164.replace(/\D/g, "");
  return digits.startsWith("234") ? digits.slice(3) : digits;
}
