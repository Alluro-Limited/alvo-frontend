import type {Message} from "@/lib/i18n";
import {m} from "@/paraglide/messages";

export interface PasswordRule {
  id: string;
  label: Message;
  test: (password: string) => boolean;
}

/** The policy shown as chips under "Confirm password", in Figma order; validation reads the same list. */
export const PASSWORD_RULES: readonly PasswordRule[] = [
  {id: "uppercase", label: m["reset_password.rules.uppercase"], test: (password) => /[A-Z]/.test(password)},
  {id: "lowercase", label: m["reset_password.rules.lowercase"], test: (password) => /[a-z]/.test(password)},
  {id: "number", label: m["reset_password.rules.number"], test: (password) => /\d/.test(password)},
  {id: "length", label: m["reset_password.rules.length"], test: (password) => password.length >= 8},
  {id: "symbol", label: m["reset_password.rules.symbol"], test: (password) => /[^A-Za-z0-9\s]/.test(password)},
];

export function meetsPasswordRules(password: string): boolean {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}
