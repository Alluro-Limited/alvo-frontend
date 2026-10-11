import {fireEvent, screen} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {SidebarBottom} from "@/components/app-shell/sidebar-bottom";
import {OnboardingProvider} from "@/components/onboarding/onboarding-context";
import {authService} from "@/services/auth-service";
import {renderRoute} from "@/test/render-route";

vi.mock("@/services/auth-service", () => ({
  authService: {signIn: vi.fn(), signUp: vi.fn(), verifyEmail: vi.fn(), resendVerificationCode: vi.fn(), signOut: vi.fn()},
}));

const signOut = vi.mocked(authService.signOut);

const renderSidebarBottom = () =>
  renderRoute(
    () => (
      <OnboardingProvider>
        <SidebarBottom collapsed={false} />
      </OnboardingProvider>
    ),
    "/settings"
  );

describe("SignOutDialog", () => {
  beforeEach(() => signOut.mockReset());

  it("opens the confirmation dialog from the sidebar Logout button", async () => {
    renderSidebarBottom();
    fireEvent.click(await screen.findByRole("button", {name: "nav.logout"}));
    expect(await screen.findByText("signout.title")).toBeTruthy();
    expect(screen.getByText("signout.subtitle")).toBeTruthy();
    expect(screen.getByRole("button", {name: "signout.confirm"})).toBeTruthy();
    expect(screen.getByRole("button", {name: "pay.cancel"})).toBeTruthy();
  });

  it("closes on Cancel without signing out", async () => {
    renderSidebarBottom();
    fireEvent.click(await screen.findByRole("button", {name: "nav.logout"}));
    fireEvent.click(await screen.findByRole("button", {name: "pay.cancel"}));
    expect(signOut).not.toHaveBeenCalled();
  });

  it("signs out and navigates to the login page on confirm", async () => {
    signOut.mockResolvedValue(undefined);
    renderSidebarBottom();
    fireEvent.click(await screen.findByRole("button", {name: "nav.logout"}));
    fireEvent.click(await screen.findByRole("button", {name: "signout.confirm"}));
    expect(await screen.findByText("stub:/")).toBeTruthy();
    expect(signOut).toHaveBeenCalled();
  });
});
