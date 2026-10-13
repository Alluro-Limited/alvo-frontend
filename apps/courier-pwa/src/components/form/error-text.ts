import type {SimpleMessage} from "@/lib/i18n";
import {m} from "@/paraglide/messages";

/** Translates a stored message key for display, or `undefined` when no error is set. */
export function errorText(key: SimpleMessage | undefined): string | undefined {
  return key ? m[key]() : undefined;
}
