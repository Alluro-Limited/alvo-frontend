import {afterEach, describe, expect, it, vi} from "vite-plus/test";

describe("apiClient", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it("sends requests to the configured API with the Bearer token attached", async () => {
    vi.stubEnv("VITE_API_URL", "https://api.test/");
    localStorage.setItem("alvo.business.session", JSON.stringify({accessToken: "tok-123", refreshToken: "ref-456"}));
    const fetchMock = vi.fn(async () => Response.json({ok: true}));
    vi.stubGlobal("fetch", fetchMock);
    vi.resetModules();
    const {apiClient} = await import("../api-client");

    const body = await apiClient.get("v1/health").json<{ok: boolean}>();

    expect(body).toEqual({ok: true});
    const request = fetchMock.mock.calls[0][0] as Request;
    expect(request.url).toBe("https://api.test/v1/health");
    expect(request.headers.get("Authorization")).toBe("Bearer tok-123");
  });

  it("sends no Authorization header when there is no session", async () => {
    vi.stubEnv("VITE_API_URL", "https://api.test/");
    const fetchMock = vi.fn(async () => Response.json({ok: true}));
    vi.stubGlobal("fetch", fetchMock);
    vi.resetModules();
    const {apiClient} = await import("../api-client");

    await apiClient.get("v1/health").json<{ok: boolean}>();

    const request = fetchMock.mock.calls[0][0] as Request;
    expect(request.headers.get("Authorization")).toBeNull();
  });
});
