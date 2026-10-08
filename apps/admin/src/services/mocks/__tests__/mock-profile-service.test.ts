import {describe, expect, it} from "vite-plus/test";
import {mockProfileService} from "../mock-profile-service";

describe("mockProfileService", () => {
  it("returns the signed-in admin with sessions and notification prefs", async () => {
    const profile = await mockProfileService.getProfile();
    expect(profile.id).toBe("ADM-001");
    expect(profile.sessions.length).toBeGreaterThan(0);
    expect(profile.sessions.some((session) => session.current)).toBe(true);
  });

  it("updates personal info fields", async () => {
    const updated = await mockProfileService.updateProfile({
      firstName: "Dayo",
      lastName: "Ogunseye",
      email: "dayo@Alvo.ng",
      phone: "+234 900 000 0000",
      timezone: "UTC",
      dateFormat: "YYYY-MM-DD",
    });
    expect(updated.phone).toBe("+234 900 000 0000");
    expect(updated.timezone).toBe("UTC");
  });

  it("rejects a wrong current password and accepts a valid one", async () => {
    await expect(mockProfileService.changePassword({currentPassword: "no", newPassword: "newpass123"})).rejects.toThrow();
    await mockProfileService.changePassword({currentPassword: "correct1", newPassword: "newpass123"});
    const profile = await mockProfileService.getProfile();
    expect(profile.passwordChangedDaysAgo).toBe(0);
  });

  it("persists notification preference changes", async () => {
    const profile = await mockProfileService.updateNotificationPrefs({email: false, push: true, sms: true});
    expect(profile.notifications.sms).toBe(true);
    expect(profile.notifications.email).toBe(false);
  });

  it("toggles two-factor auth", async () => {
    const profile = await mockProfileService.toggleTwoFactor(false);
    expect(profile.twoFactorEnabled).toBe(false);
    await mockProfileService.toggleTwoFactor(true);
  });

  it("revokes a non-current session and refuses the current one", async () => {
    const profile = await mockProfileService.getProfile();
    const other = profile.sessions.find((session) => !session.current);
    const revoked = await mockProfileService.revokeSession(other!.id);
    expect(revoked.id).toBe(other!.id);
    const after = await mockProfileService.getProfile();
    expect(after.sessions.some((session) => session.id === other!.id)).toBe(false);
    const current = profile.sessions.find((session) => session.current);
    await expect(mockProfileService.revokeSession(current!.id)).rejects.toThrow();
  });
});
