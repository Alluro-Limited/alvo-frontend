import {afterEach, describe, expect, it, vi} from "vite-plus/test";

describe("authService.signIn", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("posts the credentials as JSON to auth/login", async () => {
    vi.stubEnv("VITE_API_URL", "https://api.test/v1");
    const sent: {method: string; url: string; body: string}[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (request: Request) => {
        sent.push({method: request.method, url: request.url, body: await request.text()});
        return new Response(null, {status: 204});
      })
    );
    vi.resetModules();
    const {authService} = await import("../auth-service");

    await authService.signIn({email: "ada@alvo.com", password: "secret"});

    expect(sent).toHaveLength(1);
    expect(sent[0].method).toBe("POST");
    expect(sent[0].url).toBe("https://api.test/v1/auth/login");
    expect(JSON.parse(sent[0].body)).toEqual({email: "ada@alvo.com", password: "secret"});
  });

  it("rejects with the HTTP error when the backend refuses the credentials", async () => {
    vi.stubEnv("VITE_API_URL", "https://api.test/v1");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(null, {status: 401}))
    );
    vi.resetModules();
    const {authService} = await import("../auth-service");

    await expect(authService.signIn({email: "ada@alvo.com", password: "wrong"})).rejects.toMatchObject({response: {status: 401}});
  });
});
