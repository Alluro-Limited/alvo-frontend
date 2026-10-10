import {mockHttpError} from "@/services/mocks/mock-http";

/** A ky `HTTPError` for the given status, optionally carrying the parsed error body the backend sent. */
export function createHttpError(status: number, data?: Record<string, string>) {
  return mockHttpError("resource", status, data);
}
