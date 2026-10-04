import {beforeEach, describe, expect, it, vi} from "vite-plus/test";

const createRouterMock = vi.fn(() => ({options: {defaultPreload: "intent"}}));
const startSentryMock = vi.fn();

vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-router")>("@tanstack/react-router");
  return {...actual, createRouter: createRouterMock};
});

vi.mock("@/lib/sentry", () => ({startSentry: startSentryMock}));

vi.mock("../routeTree.gen", () => ({routeTree: {id: "__root__"}}));

describe("getRouter", () => {
  beforeEach(() => {
    createRouterMock.mockClear();
    startSentryMock.mockClear();
  });

  it("creates the router from the generated route tree with intent preloading", async () => {
    const {getRouter} = await import("../router");
    const router = getRouter();

    expect(createRouterMock).toHaveBeenCalledWith(
      expect.objectContaining({routeTree: {id: "__root__"}, defaultPreload: "intent", scrollRestoration: true})
    );
    expect(startSentryMock).toHaveBeenCalledWith(router);
  });
});
