import ky from "ky";
import {API_BASE, getAccessToken, refreshSession} from "./session";

/**
 * Shared HTTP client for every user service. Services under `src/services`
 * build on this instead of calling `fetch` or `ky` directly, so the base URL,
 * the Bearer token, and the refresh-on-401 retry live in one place.
 */
export const apiClient = ky.create({
  prefix: API_BASE,
  hooks: {
    beforeRequest: [
      ({request}) => {
        const token = getAccessToken();
        if (token) request.headers.set("Authorization", `Bearer ${token}`);
      },
    ],
    afterResponse: [
      async ({request, response, retryCount}) => {
        if (response.status !== 401 || retryCount > 0) return;
        if (!(await refreshSession())) return;
        const headers = new Headers(request.headers);
        headers.set("Authorization", `Bearer ${getAccessToken()}`);
        return ky.retry({request: new Request(request, {headers}), code: "TOKEN_REFRESHED"});
      },
    ],
  },
});
