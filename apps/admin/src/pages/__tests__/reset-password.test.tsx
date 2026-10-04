import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {authService} from "@/services/auth-service";
import {createHttpError} from "@/test/http-error";
import {renderRoute} from "@/test/render-route";
import {ResetPasswordPage} from "../reset-password";

vi.mock("@/services/auth-service", () => ({authService: {resetPassword: vi.fn(), resendResetLink: vi.fn()}}));

const resetPassword = vi.mocked(authService.resetPassword);
const resendResetLink = vi.mocked(authService.resendResetLink);

function WithToken() {
  return <ResetPasswordPage token="link-token" />;
}

async function renderForm() {
  renderRoute(WithToken, "/reset-password");
  await screen.findByRole("heading", {level: 1, name: "reset_password.title"});
}

function fillPasswords(password: string, confirmPassword = password) {
  fireEvent.change(screen.getByLabelText("reset_password.password_label"), {target: {value: password}});
  fireEvent.change(screen.getByLabelText("reset_password.confirm_label"), {target: {value: confirmPassword}});
}

const submit = () => fireEvent.click(screen.getByRole("button", {name: "reset_password.submit"}));

describe("ResetPasswordPage", () => {
  beforeEach(() => {
    resetPassword.mockReset();
    resendResetLink.mockReset();
  });

  it("validates both fields inline without calling the backend", async () => {
    await renderForm();

    submit();
    expect(screen.getByText("reset_password.errors.password_required")).toBeTruthy();
    expect(screen.getByText("reset_password.errors.confirm_required")).toBeTruthy();

    fillPasswords("Passw0rd!", "Passw0rd?");
    submit();
    expect(screen.getByText("reset_password.errors.mismatch")).toBeTruthy();
    expect(resetPassword).not.toHaveBeenCalled();
  });

  it("disables the button while updating, then shows the password-updated screen", async () => {
    let resolve = () => {};
    resetPassword.mockReturnValue(new Promise<void>((done) => (resolve = done)));
    await renderForm();
    fillPasswords("Passw0rd!");

    submit();

    const button = (await screen.findByRole("button", {name: "reset_password.submitting"})) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(resetPassword.mock.calls[0][0]).toEqual({token: "link-token", password: "Passw0rd!"});

    resolve();
    expect(await screen.findByRole("heading", {level: 1, name: "reset_password.updated.title"})).toBeTruthy();
    expect(screen.getByRole("button", {name: "auth.back_to_sign_in"}).getAttribute("href")).toBe("/");
  });

  it("keeps the form and shows an alert for a rejected password, clearing it on edit", async () => {
    resetPassword.mockRejectedValue(createHttpError(400));
    await renderForm();
    fillPasswords("Passw0rd!");

    submit();

    expect((await screen.findByRole("alert")).textContent).toBe("reset_password.errors.rejected");
    fillPasswords("Passw0rd!!");
    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
  });

  it("switches to the expired screen on 410 and resends without asking for the email", async () => {
    resetPassword.mockRejectedValue(createHttpError(410));
    resendResetLink.mockResolvedValue({maskedEmail: "ol***@alvo.com"});
    await renderForm();
    fillPasswords("Passw0rd!");

    submit();

    expect(await screen.findByRole("heading", {level: 1, name: "reset_password.expired.title"})).toBeTruthy();
    expect(screen.getByRole("alert").textContent).toBe("reset_password.expired.alert");

    fireEvent.click(screen.getByRole("button", {name: "reset_password.expired.resend"}));

    expect(await screen.findByRole("heading", {level: 1, name: "reset_password.resent.title"})).toBeTruthy();
    expect(resendResetLink.mock.calls[0][0]).toBe("link-token");
    expect(screen.getByRole("status").textContent).toBe("reset_password.resent.alert");
  });

  it("shows the resend failure in the expired screen's alert", async () => {
    resetPassword.mockRejectedValue(createHttpError(410));
    resendResetLink.mockRejectedValue(createHttpError(503));
    await renderForm();
    fillPasswords("Passw0rd!");
    submit();
    await screen.findByRole("heading", {level: 1, name: "reset_password.expired.title"});

    fireEvent.click(screen.getByRole("button", {name: "reset_password.expired.resend"}));

    await waitFor(() => expect(screen.getByRole("alert").textContent).toBe("auth.errors.service_unavailable"));
  });

  it("treats a link without a token as expired and sends the user to request a new one", async () => {
    renderRoute(ResetPasswordPage, "/reset-password");

    expect(await screen.findByRole("heading", {level: 1, name: "reset_password.expired.title"})).toBeTruthy();
    expect(screen.getByRole("button", {name: "reset_password.expired.resend"}).getAttribute("href")).toBe("/forgot-password");
  });
});
