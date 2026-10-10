import * as v from "valibot";
import {m} from "@/paraglide/messages";

/** An empty allow-list accepts any domain, so local setups work without configuration. */
export function isWorkEmail(email: string, workDomains: readonly string[]): boolean {
  if (workDomains.length === 0) return true;
  const domain = email.slice(email.lastIndexOf("@") + 1).toLowerCase();
  return workDomains.includes(domain);
}

/** Required, well-formed and on a work domain. Each screen words the "required" case its own way. */
export function createWorkEmailSchema(workDomains: readonly string[], requiredMessage: () => string) {
  return v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty(requiredMessage),
    v.email(() => m["auth.errors.email_invalid"]()),
    v.check(
      (email) => isWorkEmail(email, workDomains),
      () => m["auth.errors.email_not_work"]()
    )
  );
}
