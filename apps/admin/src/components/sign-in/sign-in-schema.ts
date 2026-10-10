import * as v from "valibot";
import {createWorkEmailSchema} from "@/components/auth/work-email-schema";
import {m} from "@/paraglide/messages";

export function createSignInSchema(workDomains: readonly string[]) {
  return v.object({
    email: createWorkEmailSchema(workDomains, () => m["sign_in.errors.email_required"]()),
    password: v.pipe(
      v.string(),
      v.nonEmpty(() => m["sign_in.errors.password_required"]())
    ),
  });
}
