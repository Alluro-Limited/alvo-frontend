import {describe, expect, it} from "vite-plus/test";
import {createHttpError} from "@/test/http-error";
import {getSignInErrorMessage} from "../sign-in-errors";

describe("getSignInErrorMessage", () => {
  it("shows the backend's message when it sends one", () => {
    expect(getSignInErrorMessage(createHttpError(401, {message: "Account suspended."}))).toBe("Account suspended.");
  });

  it.each([
    [400, "sign_in.errors.invalid_credentials"],
    [401, "sign_in.errors.invalid_credentials"],
    [429, "auth.errors.too_many_attempts"],
    [500, "auth.errors.service_unavailable"],
    [503, "auth.errors.service_unavailable"],
  ])("maps status %i to %s when the backend sends no message", (status, key) => {
    expect(getSignInErrorMessage(createHttpError(status))).toBe(key);
  });

  it("treats network failures as the service being unavailable", () => {
    expect(getSignInErrorMessage(new TypeError("Failed to fetch"))).toBe("auth.errors.service_unavailable");
  });
});
