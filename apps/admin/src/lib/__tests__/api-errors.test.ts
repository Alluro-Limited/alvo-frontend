import {HTTPError, type NormalizedOptions} from "ky";
import {describe, expect, it} from "vite-plus/test";
import {API_ERROR_CODES, getErrorCode, getErrorMessage} from "../api-errors";

function httpError(status: number) {
  const request = new Request("https://api.test/resource");
  return new HTTPError(new Response(null, {status}), request, {} as NormalizedOptions);
}

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
