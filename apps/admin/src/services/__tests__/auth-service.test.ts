import {afterEach, describe, expect, it, vi} from "vite-plus/test";

async function loadAuthService(apiUrl: string) {
  vi.stubEnv("VITE_API_URL", apiUrl);
  vi.resetModules();
  const [{authService}, {httpAuthService}, {mockAuthService}] = await Promise.all([
    import("../auth-service"),
    import("../http-auth-service"),
    import("../mocks/mock-auth-service"),
  ]);
  return {authService, httpAuthService, mockAuthService};
}

describe("authService", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("uses the local mock while no backend URL is configured", async () => {
    const {authService, mockAuthService} = await loadAuthService("");

    expect(authService).toBe(mockAuthService);
  });

  it("uses HTTP once a backend URL is configured", async () => {
    const {authService, httpAuthService} = await loadAuthService("https://api.test/v1");

    expect(authService).toBe(httpAuthService);
  });
});
