import * as v from "valibot";
import {isValidPhoneNumber} from "libphonenumber-js";
import {m} from "@/paraglide/messages";

/** Real per-country validation on the combined E.164 value the phone field emits. */
const phoneSchema = (message: () => string) =>
  v.pipe(
    v.string(),
    v.nonEmpty(message),
    v.check((value) => isValidPhoneNumber(value), message)
  );

export const businessInfoSchema = v.object({
  businessName: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty(() => m["sign_up.errors.field_required"]())
  ),
  businessType: v.pipe(
    v.string(),
    v.nonEmpty(() => m["sign_up.errors.business_type_required"]())
  ),
  businessPhone: phoneSchema(() => m["sign_up.errors.business_phone_invalid"]()),
  businessEmail: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty(() => m["sign_up.errors.business_email_invalid"]()),
    v.email(() => m["sign_up.errors.business_email_invalid"]())
  ),
});

export const personalDetailsSchema = v.object({
  firstName: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty(() => m["sign_up.errors.first_name_required"]())
  ),
  lastName: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty(() => m["sign_up.errors.last_name_required"]())
  ),
  phone: phoneSchema(() => m["sign_up.errors.phone_invalid"]()),
  email: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty(() => m["sign_up.errors.email_invalid"]()),
    v.email(() => m["sign_up.errors.email_invalid"]())
  ),
  password: v.pipe(
    v.string(),
    v.nonEmpty(() => m["sign_up.errors.password_required"]()),
    v.minLength(8, () => m["sign_up.errors.password_min"]())
  ),
});

export const OTP_LENGTH = 6;
