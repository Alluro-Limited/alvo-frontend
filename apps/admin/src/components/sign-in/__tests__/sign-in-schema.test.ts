import * as v from "valibot";
import {describe, expect, it} from "vite-plus/test";
import {createSignInSchema} from "../sign-in-schema";

function firstIssues(workDomains: string[], input: {email: string; password: string}) {
  const schema = createSignInSchema(workDomains);
  const result = v.safeParse(schema, input);
  if (result.success) return {output: result.output};
  const nested = v.flatten<typeof schema>(result.issues).nested;
  return {email: nested?.email?.[0], password: nested?.password?.[0]};
}

describe("createSignInSchema", () => {
  it("asks for both fields when they are empty", () => {
    expect(firstIssues(["alvo.com"], {email: "  ", password: ""})).toEqual({
      email: "sign_in.errors.email_required",
      password: "sign_in.errors.password_required",
    });
  });

  it("applies the shared work-email rules", () => {
    expect(firstIssues(["alvo.com"], {email: "ada@gmail.com", password: "x"}).email).toBe("auth.errors.email_not_work");
  });

  it("returns trimmed credentials for a valid work email", () => {
    expect(firstIssues(["alvo.com"], {email: " ada@alvo.com ", password: " pass "})).toEqual({
      output: {email: "ada@alvo.com", password: " pass "},
    });
  });
});
