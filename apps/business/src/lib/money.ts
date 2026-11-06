/** The API's int64 `*_kobo` strings → naira amount. */
export function koboToNaira(kobo?: string): number {
  return Number(kobo ?? "0") / 100;
}
