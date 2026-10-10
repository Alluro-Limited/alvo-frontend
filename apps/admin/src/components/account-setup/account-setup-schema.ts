import * as v from "valibot";
import {m} from "@/paraglide/messages";

export const accountSetupSchema = v.object({
  firstName: v.pipe(
    v.string(),
    v.nonEmpty(() => m["account_setup.errors.first_name_required"]())
  ),
  lastName: v.pipe(
    v.string(),
    v.nonEmpty(() => m["account_setup.errors.last_name_required"]())
  ),
  password: v.pipe(
    v.string(),
    v.nonEmpty(() => m["account_setup.errors.password_required"]())
  ),
});
