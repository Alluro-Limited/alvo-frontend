import {describe, expect, it} from "vite-plus/test";
import {createHttpError} from "@/test/http-error";
import {getSignUpErrorMessage, getVerificationError} from "../sign-up-errors";

describe("getSignUpErrorMessage", () => {
  it("maps a 409 to the email-taken copy", () => {
    expect(getSignUpErrorMessage(createHttpError(409))).toBe("sign_up.errors.email_taken");
  });

  it("maps a 429 to the rate-limit copy", () => {
    expect(getSignUpErrorMessage(createHttpError(429))).toBe("sign_up.errors.too_many_attempts");
  });

  it("falls back to service-unavailable and prefers the backend's own message", () => {
    expect(getSignUpErrorMessage(createHttpError(500))).toBe("sign_up.errors.service_unavailable");
    expect(getSignUpErrorMessage(new Error("offline"))).toBe("sign_up.errors.service_unavailable");
    expect(getSignUpErrorMessage(createHttpError(400, {message: "Phone already in use."}))).toBe("Phone already in use.");
  });
});

describe("getVerificationError", () => {
  it("maps 400/401 to the designed incorrect-code banner", () => {
    for (const status of [400, 401]) {
      expect(getVerificationError(createHttpError(status))).toEqual({
        title: "sign_up.errors.incorrect_code_title",
        body: "sign_up.errors.incorrect_code_body",
      });
    }
  });

  it("keeps the incorrect-code banner even when the 400 carries a message", () => {
    expect(getVerificationError(createHttpError(400, {message: "Bad code"})).title).toBe("sign_up.errors.incorrect_code_title");
  });

  it("maps other failures to the generic banner with the mapped body", () => {
    expect(getVerificationError(createHttpError(429))).toEqual({
      title: "sign_up.errors.verification_failed",
      body: "sign_up.errors.too_many_attempts",
    });
    expect(getVerificationError(new Error("offline")).body).toBe("sign_up.errors.service_unavailable");
  });
});
