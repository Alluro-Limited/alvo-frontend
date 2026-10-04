import * as v from "valibot";
import {m} from "@/paraglide/messages";

/** An empty allow-list accepts any domain, so local setups work without configuration. */
export function isWorkEmail(email: string, workDomains: readonly string[]): boolean {
  if (workDomains.length === 0) return true;
  const domain = email.slice(email.lastIndexOf("@") + 1).toLowerCase();
  return workDomains.includes(domain);
}

export function createSignInSchema(workDomains: readonly string[]) {
  return v.object({
    email: v.pipe(
      v.string(),
      v.trim(),
      v.nonEmpty(() => m["sign_in.errors.email_required"]()),
      v.email(() => m["sign_in.errors.email_invalid"]()),
      v.check(
        (email) => isWorkEmail(email, workDomains),
        () => m["sign_in.errors.email_not_work"]()
      )
    ),
    password: v.pipe(
      v.string(),
      v.nonEmpty(() => m["sign_in.errors.password_required"]())
    ),
  });
}
