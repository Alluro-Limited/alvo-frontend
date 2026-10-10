import * as v from "valibot";
import {describe, expect, it} from "vite-plus/test";
import {meetsPasswordRules, PASSWORD_RULES} from "../password-rules";
import {resetPasswordSchema} from "../reset-password-schema";

function firstIssue(password: string, confirmPassword: string) {
  const result = v.safeParse(resetPasswordSchema, {password, confirmPassword});
  return result.success ? null : result.issues[0].message;
}

describe("PASSWORD_RULES", () => {
  it("lists the rules in Figma chip order", () => {
    expect(PASSWORD_RULES.map((rule) => rule.id)).toEqual(["uppercase", "lowercase", "number", "length", "symbol"]);
  });

  it.each([
    ["uppercase", "abcdef1!", "Abcdef1!"],
    ["lowercase", "ABCDEF1!", "ABCDEf1!"],
    ["number", "Abcdefg!", "Abcdef1!"],
    ["length", "Ab1!", "Abcdef1!"],
    ["symbol", "Abcdefg1", "Abcdef1!"],
  ])("%s rejects %s and accepts %s", (id, failing, passing) => {
    const rule = PASSWORD_RULES.find((candidate) => candidate.id === id);
    expect(rule?.test(failing)).toBe(false);
    expect(rule?.test(passing)).toBe(true);
  });

  it("does not count whitespace as a special character", () => {
    expect(meetsPasswordRules("Abcdef 1")).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  it("rejects a password that misses a rule", () => {
    expect(firstIssue("abcdefgh", "abcdefgh")).toBe("reset_password.errors.password_weak");
  });

  it("asks for the confirmation", () => {
    expect(firstIssue("Passw0rd!", "")).toBe("reset_password.errors.confirm_required");
  });

  it("flags a confirmation that does not match", () => {
    expect(firstIssue("Passw0rd!", "Passw0rd?")).toBe("reset_password.errors.mismatch");
  });

  it("accepts a strong, matching password", () => {
    expect(firstIssue("Passw0rd!", "Passw0rd!")).toBeNull();
  });
});
