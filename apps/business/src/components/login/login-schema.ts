import * as v from "valibot";
import {m} from "@/paraglide/messages";

export const loginSchema = v.object({
  email: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty(() => m["login.errors.email_required"]()),
    v.email(() => m["login.errors.email_invalid"]())
  ),
  password: v.pipe(
    v.string(),
    v.nonEmpty(() => m["login.errors.password_required"]())
  ),
});
