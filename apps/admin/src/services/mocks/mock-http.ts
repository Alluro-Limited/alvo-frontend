import {HTTPError, type NormalizedOptions} from "ky";

/** Simulated network latency, long enough to see loading states. */
export const MOCK_LATENCY_MS = 800;

export function mockDelay(ms: number = MOCK_LATENCY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** The same `HTTPError` ky throws for a real failed response, so error handling is exercised unchanged. */
export function mockHttpError(path: string, status: number, data?: Record<string, string>): HTTPError {
  const request = new Request(`https://mock.alvo.local/${path}`, {method: "POST"});
  const error = new HTTPError(new Response(null, {status}), request, {} as NormalizedOptions);
  error.data = data;
  return error;
}
