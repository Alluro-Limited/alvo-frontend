import * as v from "valibot";
import {describe, expect, it} from "vite-plus/test";
import {createWorkEmailSchema, isWorkEmail} from "../work-email-schema";

const required = () => "required";

function firstIssue(workDomains: string[], email: string) {
  const result = v.safeParse(createWorkEmailSchema(workDomains, required), email);
  return result.success ? {output: result.output} : {issue: result.issues[0].message};
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

describe("createWorkEmailSchema", () => {
  it("uses the caller's wording when the email is empty", () => {
    expect(firstIssue(["alvo.com"], "   ")).toEqual({issue: "required"});
  });

  it("rejects a malformed email", () => {
    expect(firstIssue([], "not-an-email")).toEqual({issue: "auth.errors.email_invalid"});
  });

  it("rejects an email outside the work domains", () => {
    expect(firstIssue(["alvo.com"], "ada@gmail.com")).toEqual({issue: "auth.errors.email_not_work"});
  });

  it("returns the trimmed email when valid", () => {
    expect(firstIssue(["alvo.com"], " ada@alvo.com ")).toEqual({output: "ada@alvo.com"});
  });
});
