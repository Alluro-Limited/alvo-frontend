import {afterEach, describe, expect, it, vi} from "vite-plus/test";

type SentRequest = {method: string; url: string; body: string};

async function loadService(response: () => Response = () => new Response(null, {status: 204})) {
  vi.stubEnv("VITE_API_URL", "https://api.test/");
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

const sessionBody = () =>
  Response.json({accessToken: "at", refreshToken: "rt", admin: {id: "a1", name: "Ada Admin", status: "ADMIN_STATUS_ACTIVE"}});

describe("httpAuthService", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    localStorage.clear();
    window.history.pushState({}, "", "/");
  });

  it("signIn posts to admin/auth/sign-in, stores tokens, and returns the account status", async () => {
    const {service, sent} = await loadService(sessionBody);

    await expect(service.signIn({email: "ada@alvo.com", password: "secret"})).resolves.toEqual({accountStatus: "active"});
    expect(sent[0].method).toBe("POST");
    expect(sent[0].url).toBe("https://api.test/v1/admin/auth/sign-in");
    expect(JSON.parse(sent[0].body)).toEqual({email: "ada@alvo.com", password: "secret"});
    expect(localStorage.getItem("alvo.admin.session")).toContain("at");
  });

  it("signIn maps an invited admin to setup_required", async () => {
    const {service} = await loadService(() =>
      Response.json({accessToken: "at", refreshToken: "rt", admin: {id: "a1", name: "Ada", status: "INVITED"}})
    );

    await expect(service.signIn({email: "a@alvo.com", password: "x"})).resolves.toEqual({accountStatus: "setup_required"});
  });

  it("signIn rejects when the backend wants a TOTP second factor", async () => {
    const {service} = await loadService(() => Response.json({totpRequired: true, refreshToken: "rt"}));

    await expect(service.signIn({email: "a@alvo.com", password: "x"})).rejects.toThrow();
  });

  it("getAccountSetup posts the invitation token to invitations/lookup", async () => {
    window.history.pushState({}, "", "/account-setup?token=inv-9");
    const {service, sent} = await loadService(() => Response.json({invitedBy: "Dayo", roleLabel: "Viewer"}));

    await expect(service.getAccountSetup()).resolves.toEqual({invitedBy: "Dayo", roleLabel: "Viewer"});
    expect(sent[0].method).toBe("POST");
    expect(sent[0].url).toBe("https://api.test/v1/admin/invitations/lookup");
    expect(JSON.parse(sent[0].body)).toEqual({token: "inv-9"});
  });

  it("completeAccountSetup posts the token and names to invitations/accept", async () => {
    window.history.pushState({}, "", "/account-setup?token=inv-9");
    const {service, sent} = await loadService();

    await service.completeAccountSetup({firstName: "Ada", lastName: "Lovelace", password: "Passw0rd!"});
    expect(sent[0].url).toBe("https://api.test/v1/admin/invitations/accept");
    expect(JSON.parse(sent[0].body)).toEqual({token: "inv-9", firstName: "Ada", lastName: "Lovelace", password: "Passw0rd!"});
  });

  it("requestPasswordReset and resendResetLink post to auth/recovery", async () => {
    const {service, sent} = await loadService(() => Response.json({maskedEmail: "ol***@alvo.com"}));

    await service.requestPasswordReset("ada@alvo.com");
    expect(sent[0].url).toBe("https://api.test/v1/admin/auth/recovery");
    expect(JSON.parse(sent[0].body)).toEqual({email: "ada@alvo.com"});

    await expect(service.resendResetLink("t1")).resolves.toEqual({maskedEmail: "ol***@alvo.com"});
    expect(sent[1].url).toBe("https://api.test/v1/admin/auth/recovery");
    expect(JSON.parse(sent[1].body)).toEqual({token: "t1"});
  });

  it("resetPassword posts token + password to recovery/complete", async () => {
    const {service, sent} = await loadService();

    await service.resetPassword({token: "t1", password: "Passw0rd!"});
    expect(sent[0].url).toBe("https://api.test/v1/admin/auth/recovery/complete");
    expect(JSON.parse(sent[0].body)).toEqual({token: "t1", password: "Passw0rd!"});
  });

  it("getCurrentUser reads the admin name from v1/admin/me", async () => {
    const {service, sent} = await loadService(() => Response.json({admin: {name: "Dayo Ogunseye"}}));

    await expect(service.getCurrentUser()).resolves.toEqual({name: "Dayo Ogunseye"});
    expect(sent[0].method).toBe("GET");
    expect(sent[0].url).toBe("https://api.test/v1/admin/me");
  });

  it("signOut posts the refresh token to auth/logout and clears the session", async () => {
    localStorage.setItem("alvo.admin.session", JSON.stringify({accessToken: "at", refreshToken: "rt"}));
    const {service, sent} = await loadService();

    await service.signOut();
    expect(sent[0].url).toBe("https://api.test/v1/admin/auth/logout");
    expect(JSON.parse(sent[0].body)).toEqual({refreshToken: "rt"});
    expect(localStorage.getItem("alvo.admin.session")).toBeNull();
  });

  it("signOut without a session makes no request", async () => {
    const {service, sent} = await loadService();

    await service.signOut();
    expect(sent).toHaveLength(0);
  });
});
