import * as v from "valibot";
import {m} from "@/paraglide/messages";

// Loose on purpose: accept digits with the usual separators, at least 7 digits total.
const phoneRegex = /^\+?[0-9][0-9\s()-]{6,}$/;

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
  businessPhone: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty(() => m["sign_up.errors.business_phone_invalid"]()),
    v.regex(phoneRegex, () => m["sign_up.errors.business_phone_invalid"]())
  ),
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
  phone: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty(() => m["sign_up.errors.phone_invalid"]()),
    v.regex(phoneRegex, () => m["sign_up.errors.phone_invalid"]())
  ),
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

export const OTP_LENGTH = 5;
