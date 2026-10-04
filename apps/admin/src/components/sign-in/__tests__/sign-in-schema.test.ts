import * as v from "valibot";
import {describe, expect, it} from "vite-plus/test";
import {createSignInSchema, isWorkEmail} from "../sign-in-schema";

function firstIssues(workDomains: string[], input: {email: string; password: string}) {
  const schema = createSignInSchema(workDomains);
  const result = v.safeParse(schema, input);
  if (result.success) return {output: result.output};
  const nested = v.flatten<typeof schema>(result.issues).nested;
  return {email: nested?.email?.[0], password: nested?.password?.[0]};
}

describe("isWorkEmail", () => {
  it("accepts any domain when no allow-list is configured", () => {
    expect(isWorkEmail("ada@gmail.com", [])).toBe(true);
  });

  it("matches the domain case-insensitively against the allow-list", () => {
    expect(isWorkEmail("olatunji@Alvo.com", ["alvo.com"])).toBe(true);
    expect(isWorkEmail("ada@gmail.com", ["alvo.com"])).toBe(false);
    expect(isWorkEmail("ada@sub.alvo.com", ["alvo.com"])).toBe(false);
  });
});

describe("createSignInSchema", () => {
  it("asks for both fields when they are empty", () => {
    expect(firstIssues(["alvo.com"], {email: "  ", password: ""})).toEqual({
      email: "sign_in.errors.email_required",
      password: "sign_in.errors.password_required",
    });
  });

  it("rejects a malformed email", () => {
    expect(firstIssues([], {email: "not-an-email", password: "x"}).email).toBe("sign_in.errors.email_invalid");
  });

  it("rejects an email outside the work domains", () => {
    expect(firstIssues(["alvo.com"], {email: "ada@gmail.com", password: "x"}).email).toBe("sign_in.errors.email_not_work");
  });

  it("returns trimmed credentials for a valid work email", () => {
    expect(firstIssues(["alvo.com"], {email: " ada@alvo.com ", password: " pass "})).toEqual({
      output: {email: "ada@alvo.com", password: " pass "},
    });
  });
});
