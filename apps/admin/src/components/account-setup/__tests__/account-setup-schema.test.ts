import * as v from "valibot";
import {describe, expect, it} from "vite-plus/test";
import {accountSetupSchema} from "../account-setup-schema";

const valid = {firstName: "Ada", lastName: "Lovelace", password: "Passw0rd!"};

describe("accountSetupSchema", () => {
  it("accepts a complete submission", () => {
    expect(v.safeParse(accountSetupSchema, valid).success).toBe(true);
  });

  it.each([
    ["firstName", "account_setup.errors.first_name_required"],
    ["lastName", "account_setup.errors.last_name_required"],
    ["password", "account_setup.errors.password_required"],
  ] as const)("rejects an empty %s with its own message", (field, message) => {
    const result = v.safeParse(accountSetupSchema, {...valid, [field]: ""});

    expect(result.success).toBe(false);
    expect(result.issues?.[0].message).toBe(message);
  });
});
