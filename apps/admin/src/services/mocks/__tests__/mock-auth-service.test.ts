import {afterEach, beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {MOCK_AUTH, mockAuthService} from "../mock-auth-service";
import {MOCK_LATENCY_MS} from "../mock-http";

/** Settles a mock call by fast-forwarding its simulated latency. */
async function settle<T>(promise: Promise<T>) {
  const settled = promise.then(
    (value) => ({ok: true as const, value}),
    (error: Error & {response?: Response}) => ({ok: false as const, status: error.response?.status})
  );
  await vi.advanceTimersByTimeAsync(MOCK_LATENCY_MS);
  return settled;
}

describe("mockAuthService", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  describe("signIn", () => {
    it("accepts the mock password for any email and reports an active account", async () => {
      expect(await settle(mockAuthService.signIn({email: "ada@alvo.com", password: MOCK_AUTH.password}))).toEqual({
        ok: true,
        value: {accountStatus: "active"},
      });
    });

    it("reports an invited email as needing account setup", async () => {
      expect(await settle(mockAuthService.signIn({email: MOCK_AUTH.invitedEmail, password: MOCK_AUTH.password}))).toEqual({
        ok: true,
        value: {accountStatus: "setup_required"},
      });
    });

    it("rejects any other password as 401", async () => {
      expect(await settle(mockAuthService.signIn({email: "ada@alvo.com", password: "nope"}))).toEqual({ok: false, status: 401});
    });

    it.each([
      [MOCK_AUTH.unavailableEmail, 503],
      [MOCK_AUTH.rateLimitedEmail.toUpperCase(), 429],
    ])("fails %s with %i", async (email, status) => {
      expect(await settle(mockAuthService.signIn({email, password: MOCK_AUTH.password}))).toEqual({ok: false, status});
    });
  });

  describe("account setup", () => {
    it("returns the invitation the invited admin sees", async () => {
      expect(await settle(mockAuthService.getAccountSetup())).toEqual({ok: true, value: MOCK_AUTH.invitation});
    });

    it("activates the account for an ordinary invited sign-in", async () => {
      await settle(mockAuthService.signIn({email: MOCK_AUTH.invitedEmail, password: MOCK_AUTH.password}));

      expect(await settle(mockAuthService.completeAccountSetup({firstName: "Ada", lastName: "Lovelace", password: "x"}))).toEqual({
        ok: true,
        value: undefined,
      });
    });

    it.each([
      [MOCK_AUTH.invitedExpiredEmail, 410],
      [MOCK_AUTH.invitedUnavailableEmail, 503],
    ])("fails activation for %s with %i", async (email, status) => {
      await settle(mockAuthService.signIn({email, password: MOCK_AUTH.password}));

      expect(await settle(mockAuthService.completeAccountSetup({firstName: "Ada", lastName: "Lovelace", password: "x"}))).toEqual({
        ok: false,
        status,
      });
    });
  });

  describe("requestPasswordReset", () => {
    it("always succeeds for ordinary emails so it never reveals whether an account exists", async () => {
      expect(await settle(mockAuthService.requestPasswordReset("nobody@alvo.com"))).toEqual({ok: true, value: undefined});
    });

    it("fails the outage email with 503", async () => {
      expect(await settle(mockAuthService.requestPasswordReset(MOCK_AUTH.unavailableEmail))).toEqual({ok: false, status: 503});
    });
  });

  describe("resetPassword", () => {
    it("succeeds for a live token", async () => {
      expect(await settle(mockAuthService.resetPassword({token: "valid-token", password: "x"}))).toEqual({ok: true, value: undefined});
    });

    it.each([
      [MOCK_AUTH.expiredToken, 410],
      [MOCK_AUTH.unavailableToken, 503],
    ])("fails token %s with %i", async (token, status) => {
      expect(await settle(mockAuthService.resetPassword({token, password: "x"}))).toEqual({ok: false, status});
    });
  });

  describe("resendResetLink", () => {
    it("issues a new link for an expired token", async () => {
      expect(await settle(mockAuthService.resendResetLink(MOCK_AUTH.expiredToken))).toEqual({
        ok: true,
        value: {maskedEmail: MOCK_AUTH.maskedEmail},
      });
    });

    it("fails the outage token with 503", async () => {
      expect(await settle(mockAuthService.resendResetLink(MOCK_AUTH.unavailableToken))).toEqual({ok: false, status: 503});
    });
  });
});
