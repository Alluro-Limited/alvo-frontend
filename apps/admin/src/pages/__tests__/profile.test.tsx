import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {profileService} from "@/services/profile-service";
import {authService} from "@/services/auth-service";
import {renderRoute} from "@/test/render-route";
import type {AdminProfile, ProfileOptions} from "@/types/profile-types";
import {ProfilePage} from "../profile";

vi.mock("@/services/profile-service", () => ({
  profileService: {
    getProfile: vi.fn(),
    getProfileOptions: vi.fn(),
    updateProfile: vi.fn(),
    changePassword: vi.fn(),
    updateNotificationPrefs: vi.fn(),
    toggleTwoFactor: vi.fn(),
    revokeSession: vi.fn(),
  },
}));

vi.mock("@/services/auth-service", () => ({
  authService: {signOut: vi.fn()},
}));

const getProfile = vi.mocked(profileService.getProfile);
const getProfileOptions = vi.mocked(profileService.getProfileOptions);
const updateProfile = vi.mocked(profileService.updateProfile);
const changePassword = vi.mocked(profileService.changePassword);
const toggleTwoFactor = vi.mocked(profileService.toggleTwoFactor);
const revokeSession = vi.mocked(profileService.revokeSession);
const signOut = vi.mocked(authService.signOut);

const PROFILE: AdminProfile = {
  id: "ADM-001",
  firstName: "Dayo",
  lastName: "Ogunseye",
  email: "dayo@alvo.ng",
  phone: "+234 801 234 5678",
  role: "super_admin",
  roleLabel: "Super Admin",
  status: "active",
  memberSince: "Oct 1, 2025",
  lastLogin: "2 hours ago",
  passwordChangedDaysAgo: 45,
  twoFactorEnabled: true,
  timezone: "Africa/Lagos",
  dateFormat: "DD/MM/YYYY",
  notifications: {email: true, push: true, sms: false},
  sessions: [
    {id: "SES-1", device: "Chrome · macOS", location: "Lagos, Nigeria", lastActive: "", current: true},
    {id: "SES-2", device: "Safari · iPhone", location: "Abuja, Nigeria", lastActive: "2 days ago", current: false},
  ],
};

const OPTIONS: ProfileOptions = {timezones: ["Africa/Lagos", "UTC"], dateFormats: ["DD/MM/YYYY"]};

beforeEach(() => {
  vi.clearAllMocks();
  getProfile.mockResolvedValue(PROFILE);
  getProfileOptions.mockResolvedValue(OPTIONS);
  updateProfile.mockResolvedValue(PROFILE);
  changePassword.mockResolvedValue({id: "ADM-001"});
  toggleTwoFactor.mockResolvedValue(PROFILE);
  revokeSession.mockResolvedValue({id: "SES-2"});
  signOut.mockResolvedValue(undefined);
});

describe("ProfilePage", () => {
  it("renders the identity card and the personal-info panel", async () => {
    renderRoute(ProfilePage, "/profile");
    expect(await screen.findByText("Dayo Ogunseye")).toBeTruthy();
    expect(screen.getAllByText("dayo@alvo.ng").length).toBeGreaterThan(0);
    expect(screen.getByText("profile.personal_title")).toBeTruthy();
    expect(screen.getByText("profile.nav_session")).toBeTruthy();
    expect(screen.getByText("+234 801 234 5678")).toBeTruthy();
  });

  it("edits personal info and saves through the service", async () => {
    renderRoute(ProfilePage, "/profile");
    await screen.findByText("profile.personal_title");
    fireEvent.click(screen.getByRole("button", {name: "profile.edit"}));
    const input = await screen.findByRole("textbox", {name: "profile.phone"});
    fireEvent.change(input, {target: {value: "+234 900 000 0000"}});
    fireEvent.click(screen.getByRole("button", {name: "profile.save"}));
    await waitFor(() => expect(updateProfile).toHaveBeenCalledWith(expect.objectContaining({phone: "+234 900 000 0000"})));
  });

  it("opens the change-password dialog and submits both passwords", async () => {
    renderRoute(ProfilePage, "/profile");
    await screen.findByText("profile.personal_title");
    fireEvent.click(screen.getByText("profile.nav_security"));
    fireEvent.click(await screen.findByRole("button", {name: "profile.change_password"}));
    expect(await screen.findByText("profile.reset_title")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("profile.current_password"), {target: {value: "oldpassword1"}});
    fireEvent.change(screen.getByLabelText("profile.new_password"), {target: {value: "newpassword1"}});
    fireEvent.change(screen.getByLabelText("profile.confirm_password"), {target: {value: "newpassword1"}});
    fireEvent.click(screen.getByRole("button", {name: "profile.reset_submit"}));
    await waitFor(() => expect(changePassword).toHaveBeenCalledWith({currentPassword: "oldpassword1", newPassword: "newpassword1"}));
  });

  it("toggles two-factor through the mutation", async () => {
    renderRoute(ProfilePage, "/profile");
    await screen.findByText("profile.personal_title");
    fireEvent.click(screen.getByText("profile.nav_security"));
    const toggle = await screen.findByRole("switch", {name: "profile.twofa_label"});
    fireEvent.click(toggle);
    await waitFor(() => expect(toggleTwoFactor).toHaveBeenCalledWith(false));
  });

  it("revokes a non-current session from the session tab", async () => {
    renderRoute(ProfilePage, "/profile");
    await screen.findByText("profile.personal_title");
    fireEvent.click(screen.getByText("profile.nav_session"));
    expect(await screen.findByText("Safari · iPhone")).toBeTruthy();
    expect(screen.getByText("profile.session_active")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "profile.session_revoke"}));
    await waitFor(() => expect(revokeSession).toHaveBeenCalledWith("SES-2"));
  });

  it("confirms sign-out through the dialog", async () => {
    renderRoute(ProfilePage, "/profile");
    await screen.findByText("profile.personal_title");
    fireEvent.click(screen.getByRole("button", {name: "nav.logout"}));
    expect(await screen.findByText("profile.signout_title")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "profile.signout_confirm"}));
    await waitFor(() => expect(signOut).toHaveBeenCalled());
  });

  it("shows the retryable error state", async () => {
    getProfile.mockRejectedValueOnce(new Error("boom"));
    renderRoute(ProfilePage, "/profile");
    expect(await screen.findByTestId("profile-error")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "profile.retry"}));
    await waitFor(() => expect(getProfile).toHaveBeenCalledTimes(2));
  });
});
