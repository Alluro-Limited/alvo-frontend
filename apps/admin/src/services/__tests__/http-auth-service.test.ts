import {afterEach, describe, expect, it, vi} from "vite-plus/test";

type SentRequest = {method: string; url: string; body: string};

async function loadService(response: () => Response = () => new Response(null, {status: 204})) {
  vi.stubEnv("VITE_API_URL", "https://api.test/v1");
  const sent: SentRequest[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (request: Request) => {
      sent.push({method: request.method, url: request.url, body: await request.text()});
      return response();
    })
  );
  vi.resetModules();
  const {httpAuthService} = await import("../http-auth-service");
  return {service: httpAuthService, sent};
}

describe("httpAuthService", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it.each([
    ["signIn", "auth/login", {email: "ada@alvo.com", password: "secret"}],
    ["requestPasswordReset", "auth/forgot-password", {email: "ada@alvo.com"}],
    ["resetPassword", "auth/reset-password", {token: "t1", password: "Passw0rd!"}],
  ] as const)("%s posts JSON to %s", async (method, path, body) => {
    const {service, sent} = await loadService();

    if (method === "signIn") await service.signIn({email: "ada@alvo.com", password: "secret"});
    if (method === "requestPasswordReset") await service.requestPasswordReset("ada@alvo.com");
    if (method === "resetPassword") await service.resetPassword({token: "t1", password: "Passw0rd!"});

    expect(sent).toHaveLength(1);
    expect(sent[0].method).toBe("POST");
    expect(sent[0].url).toBe(`https://api.test/v1/${path}`);
    expect(JSON.parse(sent[0].body)).toEqual(body);
  });

  it("resendResetLink posts the token and returns the validated masked email", async () => {
    const {service, sent} = await loadService(() => Response.json({maskedEmail: "ol***@alvo.com"}));

    await expect(service.resendResetLink("t1")).resolves.toEqual({maskedEmail: "ol***@alvo.com"});
    expect(sent[0].url).toBe("https://api.test/v1/auth/reset-password/resend");
    expect(JSON.parse(sent[0].body)).toEqual({token: "t1"});
  });

  it("rejects a resend response that does not match the contract", async () => {
    const {service} = await loadService(() => Response.json({email: "ol***@alvo.com"}));

    await expect(service.resendResetLink("t1")).rejects.toThrow();
  });

  it("rejects with the HTTP error when the backend refuses", async () => {
    const {service} = await loadService(() => new Response(null, {status: 401}));

    await expect(service.signIn({email: "ada@alvo.com", password: "wrong"})).rejects.toMatchObject({response: {status: 401}});
  });
});
