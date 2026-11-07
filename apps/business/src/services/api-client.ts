import ky from "ky";
import {API_BASE, getAccessToken, getRefreshToken, refreshSession} from "./session";

/**
 * Shared HTTP client for every business service. The base URL, the Bearer token,
 * and the refresh-on-401 retry live here instead of in each service.
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
        const hadSession = Boolean(getRefreshToken());
        if (await refreshSession()) {
          const headers = new Headers(request.headers);
          headers.set("Authorization", `Bearer ${getAccessToken()}`);
          return ky.retry({request: new Request(request, {headers}), code: "TOKEN_REFRESHED"});
        }
        // Refresh failed — the session is already cleared; bounce to sign-in
        // instead of leaving the user on a screen of failed queries.
        if (hadSession && !location.pathname.endsWith("/")) location.assign("/");
      },
    ],
  },
});
