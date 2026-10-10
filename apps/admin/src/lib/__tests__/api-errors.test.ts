import {describe, expect, it} from "vite-plus/test";
import {createHttpError as httpError} from "@/test/http-error";
import {API_ERROR_CODES, getErrorCode, getErrorMessage, getServerMessage} from "../api-errors";

const notFound = () => "not found";
const fallback = () => "fallback";

describe("getErrorCode", () => {
  it("returns the HTTP status of a failed response", () => {
    expect(getErrorCode(httpError(404))).toBe(404);
  });

  it("returns null for errors that are not HTTP responses", () => {
    expect(getErrorCode(new Error("network down"))).toBeNull();
    expect(getErrorCode(null)).toBeNull();
    expect(getErrorCode(undefined)).toBeNull();
  });
});

describe("getServerMessage", () => {
  it("returns the trimmed message the backend sent", () => {
    expect(getServerMessage(httpError(401, {message: "  Account locked.  "}))).toBe("Account locked.");
  });

  it("returns null when the body has no usable message", () => {
    expect(getServerMessage(httpError(401))).toBeNull();
    expect(getServerMessage(httpError(401, {message: "   "}))).toBeNull();
    expect(getServerMessage(httpError(401, {error: "nope"}))).toBeNull();
  });

  it("returns null for errors that are not HTTP responses", () => {
    expect(getServerMessage(new Error("network down"))).toBeNull();
    expect(getServerMessage(null)).toBeNull();
  });
});

describe("getErrorMessage", () => {
  const context = {[API_ERROR_CODES.NOT_FOUND]: notFound};

  it("picks the message mapped to the status code", () => {
    expect(getErrorMessage(httpError(404), context, fallback)).toBe(notFound);
  });

  it("falls back when the status code is not mapped", () => {
    expect(getErrorMessage(httpError(500), context, fallback)).toBe(fallback);
  });

  it("falls back for non-HTTP errors", () => {
    expect(getErrorMessage(new Error("404"), context, fallback)).toBe(fallback);
  });
});
