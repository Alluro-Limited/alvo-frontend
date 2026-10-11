import * as v from "valibot";
import {describe, expect, it} from "vite-plus/test";
import {businessInfoSchema, personalDetailsSchema} from "../sign-up-schema";

const VALID_BUSINESS = {
  businessName: "Loop Earls",
  businessType: "sme",
  businessPhone: "+234 800 123 4567",
  businessEmail: "ops@loopearls.com",
};
const VALID_PERSONAL = {firstName: "Ada", lastName: "Obi", phone: "0800 123 4567", email: "ada@loopearls.com", password: "Password123!"};

function businessIssues(input: typeof VALID_BUSINESS) {
  const result = v.safeParse(businessInfoSchema, input);
  if (result.success) return {output: result.output};
  return v.flatten<typeof businessInfoSchema>(result.issues).nested;
}

function personalIssues(input: typeof VALID_PERSONAL) {
  const result = v.safeParse(personalDetailsSchema, input);
  if (result.success) return {output: result.output};
  return v.flatten<typeof personalDetailsSchema>(result.issues).nested;
}

describe("businessInfoSchema", () => {
  it("flags every empty field with the designed copy", () => {
    const issues = businessIssues({businessName: " ", businessType: "", businessPhone: "", businessEmail: ""});
    expect(issues?.businessName?.[0]).toBe("sign_up.errors.field_required");
    expect(issues?.businessType?.[0]).toBe("sign_up.errors.business_type_required");
    expect(issues?.businessPhone?.[0]).toBe("sign_up.errors.business_phone_invalid");
    expect(issues?.businessEmail?.[0]).toBe("sign_up.errors.business_email_invalid");
  });

  it("rejects a malformed phone and email", () => {
    const issues = businessIssues({...VALID_BUSINESS, businessPhone: "12", businessEmail: "not-an-email"});
    expect(issues?.businessPhone?.[0]).toBe("sign_up.errors.business_phone_invalid");
    expect(issues?.businessEmail?.[0]).toBe("sign_up.errors.business_email_invalid");
  });

  it("returns trimmed output for valid values", () => {
    expect(businessIssues({...VALID_BUSINESS, businessName: " Loop Earls "})).toEqual({output: VALID_BUSINESS});
  });
});

describe("personalDetailsSchema", () => {
  it("flags every empty field with the designed copy", () => {
    const issues = personalIssues({firstName: "", lastName: " ", phone: "", email: "", password: ""});
    expect(issues?.firstName?.[0]).toBe("sign_up.errors.first_name_required");
    expect(issues?.lastName?.[0]).toBe("sign_up.errors.last_name_required");
    expect(issues?.phone?.[0]).toBe("sign_up.errors.phone_invalid");
    expect(issues?.email?.[0]).toBe("sign_up.errors.email_invalid");
    expect(issues?.password?.[0]).toBe("sign_up.errors.password_required");
  });

  it("rejects a short password and malformed contact details", () => {
    const issues = personalIssues({...VALID_PERSONAL, phone: "12", email: "nope", password: "short"});
    expect(issues?.phone?.[0]).toBe("sign_up.errors.phone_invalid");
    expect(issues?.email?.[0]).toBe("sign_up.errors.email_invalid");
    expect(issues?.password?.[0]).toBe("sign_up.errors.password_min");
  });

  it("returns trimmed output for valid values", () => {
    expect(personalIssues({...VALID_PERSONAL, firstName: " Ada ", email: " ada@loopearls.com "})).toEqual({output: VALID_PERSONAL});
  });
});
