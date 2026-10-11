import {afterEach, describe, expect, it, vi} from "vite-plus/test";

describe("apiClient", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("sends requests to the configured API with cookies included", async () => {
    vi.stubEnv("VITE_API_URL", "https://api.test/v1");
    const fetchMock = vi.fn(async () => Response.json({ok: true}));
    vi.stubGlobal("fetch", fetchMock);
    vi.resetModules();
    const {apiClient} = await import("../api-client");

    const body = await apiClient.get("health").json<{ok: boolean}>();

    expect(body).toEqual({ok: true});
    const request = fetchMock.mock.calls[0][0] as Request;
    expect(request.url).toBe("https://api.test/v1/health");
    expect(request.credentials).toBe("include");
  });
});
