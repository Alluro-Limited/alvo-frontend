import ky from "ky";

/**
 * Shared HTTP client for every admin service. Services under `src/services`
 * build on this instead of calling `fetch` or `ky` directly, so the base URL and
 * cookie handling live in one place.
 */
export const apiClient = ky.create({
  prefix: import.meta.env.VITE_API_URL,
  credentials: "include",
});
