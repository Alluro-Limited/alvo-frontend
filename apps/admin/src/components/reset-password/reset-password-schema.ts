import * as v from "valibot";
import {m} from "@/paraglide/messages";
import {meetsPasswordRules} from "./password-rules";

export const resetPasswordSchema = v.pipe(
  v.object({
    password: v.pipe(
      v.string(),
      v.nonEmpty(() => m["reset_password.errors.password_required"]()),
      v.check(meetsPasswordRules, () => m["reset_password.errors.password_weak"]())
    ),
    confirmPassword: v.pipe(
      v.string(),
      v.nonEmpty(() => m["reset_password.errors.confirm_required"]())
    ),
  }),
  v.forward(
    v.partialCheck(
      [["password"], ["confirmPassword"]],
      (input) => input.password === input.confirmPassword,
      () => m["reset_password.errors.mismatch"]()
    ),
    ["confirmPassword"]
  )
);
