import {HTTPError, type NormalizedOptions} from "ky";

/** A ky `HTTPError` for the given status, optionally carrying the parsed error body the backend sent. */
export function createHttpError(status: number, data?: Record<string, string>) {
  const error = new HTTPError(new Response(null, {status}), new Request("https://api.test/resource"), {} as NormalizedOptions);
  error.data = data;
  return error;
}
