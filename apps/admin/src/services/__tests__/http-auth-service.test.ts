import {afterEach, describe, expect, it, vi} from "vite-plus/test";

type SentRequest = {method: string; url: string; body: string};

async function loadService(respond: (request: Request) => Response = () => new Response(null, {status: 204})) {
  vi.stubEnv("VITE_API_URL", "https://api.test/");
  const sent: SentRequest[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (request: Request) => {
      sent.push({method: request.method, url: request.url, body: await request.text()});
      return respond(request);
    })
  );
  vi.resetModules();
  const {httpAuthService} = await import("../http-auth-service");
  return {service: httpAuthService, sent};
}

const respondTo = (pathname: string, body: object) => (request: Request) =>
  new URL(request.url).pathname.endsWith(pathname) ? Response.json(body) : new Response(null, {status: 404});

const sessionBody = (status = "ADMIN_STATUS_ACTIVE") =>
  Response.json({accessToken: "at", refreshToken: "rt", admin: {id: "a1", name: "Ada Admin", status}});

describe("httpAuthService", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    localStorage.clear();
    sessionStorage.clear();
    window.history.pushState({}, "", "/");
  });

  it("signIn posts credentials and returns the TOTP challenge", async () => {
    const {service, sent} = await loadService(respondTo("/auth/sign-in", {challengeId: "ch-1"}));

    await expect(service.signIn({email: "ada@alvo.com", password: "secret"})).resolves.toEqual({challengeId: "ch-1"});
    expect(sent[0].method).toBe("POST");
    expect(sent[0].url).toBe("https://api.test/v1/admin/auth/sign-in");
    expect(JSON.parse(sent[0].body)).toEqual({email: "ada@alvo.com", password: "secret"});
    expect(localStorage.getItem("alvo.admin.session")).toBeNull();
  });

  it("signIn fetches the enrollment secret when the challenge requires a fresh authenticator", async () => {
    const {service, sent} = await loadService((request) => {
      const {pathname} = new URL(request.url);
      if (pathname.endsWith("/auth/sign-in")) return Response.json({challengeId: "ch-1", totpEnrollmentRequired: true});
      if (pathname.endsWith("/auth/totp/enroll")) return Response.json({secret: "JBSW", otpauthUri: "otpauth://x"});
      return new Response(null, {status: 404});
    });

    await expect(service.signIn({email: "a@alvo.com", password: "x"})).resolves.toEqual({
      challengeId: "ch-1",
      enrollment: {secret: "JBSW", otpauthUri: "otpauth://x"},
    });
    expect(sent[1].url).toBe("https://api.test/v1/admin/auth/totp/enroll");
    expect(JSON.parse(sent[1].body)).toEqual({challengeId: "ch-1"});
  });

  it("verifySecondFactor posts the code to auth/totp, stores the session, and maps account status", async () => {
    const {service, sent} = await loadService(() => sessionBody());

    await expect(service.verifySecondFactor({challengeId: "ch-1", code: "123456", enrolling: false})).resolves.toEqual({
      accountStatus: "active",
    });
    expect(sent[0].url).toBe("https://api.test/v1/admin/auth/totp");
    expect(JSON.parse(sent[0].body)).toEqual({challengeId: "ch-1", code: "123456"});
    expect(localStorage.getItem("alvo.admin.session")).toContain("at");
  });

  it("verifySecondFactor maps an invited admin to setup_required", async () => {
    const {service} = await loadService(() => sessionBody("ADMIN_STATUS_INVITED"));

    await expect(service.verifySecondFactor({challengeId: "ch-1", code: "123456", enrolling: false})).resolves.toEqual({
      accountStatus: "setup_required",
    });
  });

  it("verifySecondFactor confirms a fresh enrollment via totp/confirm", async () => {
    const {service, sent} = await loadService(() =>
      Response.json({session: {accessToken: "at", refreshToken: "rt", admin: {status: "ADMIN_STATUS_ACTIVE"}}})
    );

    await expect(service.verifySecondFactor({challengeId: "ch-1", code: "123456", enrolling: true})).resolves.toEqual({
      accountStatus: "active",
    });
    expect(sent[0].url).toBe("https://api.test/v1/admin/auth/totp/confirm");
    expect(localStorage.getItem("alvo.admin.session")).toContain("at");
  });

  it("getAccountSetup posts the invitation token to invitations/lookup", async () => {
    window.history.pushState({}, "", "/account-setup?token=inv-9");
    const {service, sent} = await loadService(respondTo("/invitations/lookup", {inviterName: "Dayo", role: "ADMIN_ROLE_VIEWER"}));

    await expect(service.getAccountSetup()).resolves.toEqual({invitedBy: "Dayo", roleLabel: "Viewer"});
    expect(sent[0].method).toBe("POST");
    expect(sent[0].url).toBe("https://api.test/v1/admin/invitations/lookup");
    expect(JSON.parse(sent[0].body)).toEqual({token: "inv-9"});
  });

  it("completeAccountSetup posts the token and names to invitations/accept, returning the challenge", async () => {
    window.history.pushState({}, "", "/account-setup?token=inv-9");
    const {service, sent} = await loadService(respondTo("/invitations/accept", {challengeId: "ch-2"}));

    await expect(service.completeAccountSetup({firstName: "Ada", lastName: "Lovelace", password: "Passw0rd!"})).resolves.toEqual({
      challengeId: "ch-2",
    });
    expect(sent[0].url).toBe("https://api.test/v1/admin/invitations/accept");
    expect(JSON.parse(sent[0].body)).toEqual({token: "inv-9", firstName: "Ada", lastName: "Lovelace", password: "Passw0rd!"});
  });

  it("requestPasswordReset and resendResetLink post the email to auth/recovery", async () => {
    const {service, sent} = await loadService(() => Response.json({}));

    await service.requestPasswordReset("ada@alvo.com");
    expect(sent[0].url).toBe("https://api.test/v1/admin/auth/recovery");
    expect(JSON.parse(sent[0].body)).toEqual({email: "ada@alvo.com"});

    await expect(service.resendResetLink("t1")).resolves.toEqual({maskedEmail: "ada@alvo.com"});
    expect(sent[1].url).toBe("https://api.test/v1/admin/auth/recovery");
    expect(JSON.parse(sent[1].body)).toEqual({email: "ada@alvo.com"});
  });

  it("resetPassword posts token + new_password to recovery/complete", async () => {
    const {service, sent} = await loadService();

    await service.resetPassword({token: "t1", password: "Passw0rd!"});
    expect(sent[0].url).toBe("https://api.test/v1/admin/auth/recovery/complete");
    expect(JSON.parse(sent[0].body)).toEqual({token: "t1", newPassword: "Passw0rd!"});
  });

  it("getCurrentUser reads the admin name from v1/admin/me", async () => {
    const {service, sent} = await loadService(respondTo("/admin/me", {name: "Dayo Ogunseye"}));

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
