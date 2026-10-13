import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {authService} from "@/services/auth-service";
import {createHttpError} from "@/test/http-error";
import {renderRoute} from "@/test/render-route";
import {SignInPage} from "../sign-in";

vi.mock("@/services/auth-service", () => ({
  authService: {
    createAccount: vi.fn(),
    requestVerificationCode: vi.fn(),
    verifyCode: vi.fn(),
    completeRegistration: vi.fn(),
    signIn: vi.fn(),
    requestPasswordReset: vi.fn(),
    verifyResetCode: vi.fn(),
    resetPassword: vi.fn(),
  },
}));

const signIn = vi.mocked(authService.signIn);

function fillForm() {
  fireEvent.change(screen.getByLabelText("su.email"), {target: {value: "ola@example.com"}});
  fireEvent.change(screen.getByLabelText("si.password_label"), {target: {value: "secret"}});
}

describe("SignInPage", () => {
  beforeEach(() => {
    signIn.mockReset().mockResolvedValue({name: "Olatunji"});
  });

  it("keeps Sign In disabled until email and password are valid", async () => {
    renderRoute(SignInPage, "/sign-in");
    await screen.findByRole("heading", {name: "si.title"});
    fireEvent.click(screen.getByRole("button", {name: "si.submit"}));
    expect(signIn).not.toHaveBeenCalled();

    fillForm();
    fireEvent.click(screen.getByRole("button", {name: "si.submit"}));
    await waitFor(() => expect(signIn).toHaveBeenCalledWith("ola@example.com", "secret"));
  });

  it("shows and dismisses the wrong-password banner on a 401", async () => {
    signIn.mockRejectedValue(createHttpError(401));
    renderRoute(SignInPage, "/sign-in");
    await screen.findByRole("heading", {name: "si.title"});
    fillForm();
    fireEvent.click(screen.getByRole("button", {name: "si.submit"}));

    expect(await screen.findByText("si.err_title")).toBeTruthy();
    expect(screen.getByText("si.err_desc")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", {name: "si.err_close"}));
    expect(screen.queryByText("si.err_title")).toBeNull();
  });

  it("greets the user on the success screen and Get Started goes to /", async () => {
    renderRoute(SignInPage, "/sign-in");
    await screen.findByRole("heading", {name: "si.title"});
    fillForm();
    fireEvent.click(screen.getByRole("button", {name: "si.submit"}));

    expect(await screen.findByText("si.success")).toBeTruthy();
    expect(screen.getByText("Olatunji")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", {name: "si.get_started"}));
    expect(await screen.findByText("stub:/home")).toBeTruthy();
  });

  it("links to reset password and sign-up", async () => {
    renderRoute(SignInPage, "/sign-in");
    await screen.findByRole("heading", {name: "si.title"});
    expect(screen.getByRole("link", {name: "si.forgot"}).getAttribute("href")).toBe("/reset-password");
    expect(screen.getByRole("link", {name: "si.sign_up"}).getAttribute("href")).toBe("/sign-up");
  });
});
