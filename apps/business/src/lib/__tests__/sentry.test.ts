import type {AnyRouter} from "@tanstack/react-router";
import {afterEach, beforeEach, describe, expect, it, vi} from "vite-plus/test";

const init = vi.fn();
const tracing = vi.fn(() => ({name: "tracing"}));

vi.mock("@sentry/react", () => ({init, tanstackRouterBrowserTracingIntegration: tracing}));

const router = {} as AnyRouter;

async function loadStartSentry() {
  vi.resetModules();
  return (await import("../sentry")).startSentry;
}

describe("startSentry", () => {
  beforeEach(() => {
    init.mockReset();
    vi.stubEnv("PROD", true);
    vi.stubEnv("VITE_SENTRY_DSN", "https://key@sentry.test/1");
    vi.stubEnv("VITE_API_URL", "https://api.test");
  });

  afterEach(() => vi.unstubAllEnvs());

  it("starts once in production with route tracing limited to the API", async () => {
    const startSentry = await loadStartSentry();

    startSentry(router);
    startSentry(router);

    expect(init).toHaveBeenCalledOnce();
    expect(init).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: "https://key@sentry.test/1",
        tracePropagationTargets: ["https://api.test"],
        dataCollection: {userInfo: false, urlQueryParams: false},
      })
    );
    expect(tracing).toHaveBeenCalledWith(router);
  });

  it("propagates traces nowhere when no API URL is set", async () => {
    vi.stubEnv("VITE_API_URL", "");
    const startSentry = await loadStartSentry();

    startSentry(router);

    expect(init).toHaveBeenCalledWith(expect.objectContaining({tracePropagationTargets: []}));
  });

  it("stays off outside production", async () => {
    vi.stubEnv("PROD", false);
    const startSentry = await loadStartSentry();

    startSentry(router);

    expect(init).not.toHaveBeenCalled();
  });

  it("stays off without a DSN", async () => {
    vi.stubEnv("VITE_SENTRY_DSN", "");
    const startSentry = await loadStartSentry();

    startSentry(router);

    expect(init).not.toHaveBeenCalled();
  });

  it("lets a later call retry when init throws", async () => {
    init.mockImplementationOnce(() => {
      throw new Error("bad dsn");
    });
    const startSentry = await loadStartSentry();

    expect(() => startSentry(router)).not.toThrow();
    startSentry(router);

    expect(init).toHaveBeenCalledTimes(2);
  });
});
