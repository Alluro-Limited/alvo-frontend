import {HTTPError} from "ky";

export const API_ERROR_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  GONE: 410,
  RATE_LIMIT: 429,
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];

/**
 * Rewrites a failed call's `HTTPError.data` to the `{code: "snake_case"}` shape the
 * screens inspect, keyed on the HTTP status. Use as `.catch(mapError({400: "invalid_code"}))`;
 * non-HTTP errors rethrow untouched.
 */
export function mapError(codes: Record<number, string>, fallback?: string) {
  return (err: Error): never => {
    if (err instanceof HTTPError) {
      const code = codes[err.response.status] ?? fallback;
      if (code) err.data = {code};
    }
    throw err;
  };
}
