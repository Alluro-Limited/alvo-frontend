import * as v from "valibot";
import {describe, expect, it} from "vite-plus/test";
import {loginSchema} from "../login-schema";

function firstIssues(input: {email: string; password: string}) {
  const result = v.safeParse(loginSchema, input);
  if (result.success) return {output: result.output};
  const nested = v.flatten<typeof loginSchema>(result.issues).nested;
  return {email: nested?.email?.[0], password: nested?.password?.[0]};
}

describe("loginSchema", () => {
  it("asks for both fields when they are empty", () => {
    expect(firstIssues({email: "  ", password: ""})).toEqual({
      email: "login.errors.email_required",
      password: "login.errors.password_required",
    });
  });

  it("rejects a malformed email", () => {
    expect(firstIssues({email: "not-an-email", password: "x"}).email).toBe("login.errors.email_invalid");
  });

  it("returns trimmed credentials for a valid email", () => {
    expect(firstIssues({email: " ada@loopearls.com ", password: " pass "})).toEqual({
      output: {email: "ada@loopearls.com", password: " pass "},
    });
  });
});
