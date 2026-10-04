import * as v from "valibot";
import {describe, expect, it} from "vite-plus/test";
import {meetsPasswordRules, PASSWORD_RULES} from "../password-rules";
import {resetPasswordSchema} from "../reset-password-schema";

function issues(password: string, confirmPassword: string) {
  const result = v.safeParse(resetPasswordSchema, {password, confirmPassword});
  if (result.success) return {ok: true};
  const nested = v.flatten<typeof resetPasswordSchema>(result.issues).nested;
  return {password: nested?.password?.[0], confirmPassword: nested?.confirmPassword?.[0]};
}

describe("PASSWORD_RULES", () => {
  it.each([
    ["length", "Ab1!", "Abcdef1!"],
    ["uppercase", "abcdef1!", "Abcdef1!"],
    ["number", "Abcdefg!", "Abcdef1!"],
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
  it("asks for both fields when empty", () => {
    expect(issues("", "")).toEqual({
      password: "reset_password.errors.password_required",
      confirmPassword: "reset_password.errors.confirm_required",
    });
  });

  it("flags a password that misses a rule", () => {
    expect(issues("abcdefgh", "abcdefgh").password).toBe("reset_password.errors.password_weak");
  });

  it("flags a confirmation that does not match", () => {
    expect(issues("Passw0rd!", "Passw0rd?")).toEqual({password: undefined, confirmPassword: "reset_password.errors.mismatch"});
  });

  it("accepts a strong, matching password", () => {
    expect(issues("Passw0rd!", "Passw0rd!")).toEqual({ok: true});
  });
});
