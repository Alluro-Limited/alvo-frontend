import {HTTPError} from "ky";
import type {Message} from "@/lib/i18n";

export const API_ERROR_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMIT: 429,
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];

/** Maps HTTP status codes to the message shown for one API operation. */
export type ErrorContext = Partial<Record<number, Message>>;

/** The HTTP status behind a failed request, or null when the error is not an HTTP response. */
export function getErrorCode(error: Error | null | undefined): number | null {
  return error instanceof HTTPError ? error.response.status : null;
}

/** Picks the message for an error by its status code, never by its text. */
export function getErrorMessage(error: Error | null | undefined, context: ErrorContext, fallback: Message): Message {
  const code = getErrorCode(error);
  return (code !== null && context[code]) || fallback;
}
