import {describe, expect, it} from "vite-plus/test";
import {createHttpError} from "@/test/http-error";
import {getLoginError} from "../login-errors";

describe("getLoginError", () => {
  it.each([400, 401])("puts status %i under the password field", (status) => {
    expect(getLoginError(createHttpError(status))).toEqual({passwordError: "login.errors.invalid_credentials"});
  });

  it.each([
    [429, "login.errors.too_many_attempts"],
    [500, "login.errors.service_unavailable"],
    [503, "login.errors.service_unavailable"],
  ])("maps status %i to alert %s", (status, key) => {
    expect(getLoginError(createHttpError(status))).toEqual({alertMessage: key});
  });

  it("shows the backend's message when it sends one", () => {
    expect(getLoginError(createHttpError(403, {message: "Account suspended."}))).toEqual({alertMessage: "Account suspended."});
  });

  it("treats network failures as the service being unavailable", () => {
    expect(getLoginError(new TypeError("Failed to fetch"))).toEqual({alertMessage: "login.errors.service_unavailable"});
  });
});
