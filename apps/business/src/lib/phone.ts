/** "08012345678" / "8012345678" / "2348012345678" → "+2348012345678" — E.164 for the API. */
export function toE164(national: string): string {
  const digits = national.replace(/\D/g, "");
  const local = digits.startsWith("234") ? digits.slice(3) : digits.startsWith("0") ? digits.slice(1) : digits;
  return `+234${local}`;
}
