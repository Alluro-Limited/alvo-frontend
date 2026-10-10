import {act, fireEvent, screen, waitFor} from "@testing-library/react";
import {afterEach, beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {RESET_PASSWORD_CONFIRM_DELAY_MS} from "@/components/reset-password/use-reset-password-form";
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

const submitButton = () => screen.getByRole("button", {name: /reset_password\.submit/}) as HTMLButtonElement;
const submit = () => fireEvent.click(submitButton());

async function reachExpiredScreen() {
  resetPassword.mockRejectedValue(createHttpError(410));
  await renderForm();
  fillPasswords("Passw0rd!");
  submit();
  await screen.findByRole("heading", {level: 1, name: "reset_password.expired.title"});
}

describe("ResetPasswordPage", () => {
  beforeEach(() => {
    resetPassword.mockReset();
    resendResetLink.mockReset();
  });
  afterEach(() => vi.useRealTimers());

  it("keeps the button disabled until every rule passes and the confirmation is filled", async () => {
    await renderForm();
    expect(submitButton().disabled).toBe(true);

    fillPasswords("password", "");
    expect(submitButton().disabled).toBe(true);

    fillPasswords("Passw0rd!", "x");
    expect(submitButton().disabled).toBe(false);
  });

  it("reports a mismatch in the alert without calling the backend, clearing it on edit", async () => {
    await renderForm();
    fillPasswords("Passw0rd!", "Passw0rd?");

    submit();

    expect(screen.getByRole("alert").textContent).toBe("reset_password.errors.mismatch");
    expect(resetPassword).not.toHaveBeenCalled();
    fillPasswords("Passw0rd!");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("re-labels the button while saving, confirms, then shows the password-updated screen", async () => {
    vi.useFakeTimers({shouldAdvanceTime: true});
    let resolve = () => {};
    resetPassword.mockReturnValue(new Promise<void>((done) => (resolve = done)));
    await renderForm();
    fillPasswords("Passw0rd!");

    submit();

    expect((await screen.findByRole("button", {name: "reset_password.submitting"})) as HTMLButtonElement).toHaveProperty("disabled", true);
    expect(resetPassword.mock.calls[0][0]).toEqual({token: "link-token", password: "Passw0rd!"});

    resolve();
    expect((await screen.findByRole("status")).textContent).toBe("reset_password.success");

    await act(() => vi.advanceTimersByTimeAsync(RESET_PASSWORD_CONFIRM_DELAY_MS));
    expect(await screen.findByRole("heading", {level: 1, name: "reset_password.updated.title"})).toBeTruthy();
    expect(screen.getByRole("button", {name: "auth.sign_in_with_new_password"}).getAttribute("href")).toBe("/");
  });

  it("shows a backend rejection in the alert and clears it on edit", async () => {
    resetPassword.mockRejectedValue(createHttpError(400));
    await renderForm();
    fillPasswords("Passw0rd!");

    submit();

    expect((await screen.findByRole("alert")).textContent).toBe("reset_password.errors.rejected");
    fillPasswords("Passw0rd!!");
    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
  });

  it("switches to the expired screen on 410, explains why, and resends without asking for the email", async () => {
    resendResetLink.mockResolvedValue({maskedEmail: "ol***@alvo.com"});
    await reachExpiredScreen();

    expect(screen.getByRole("note").textContent).toBe("reset_password.expired.alert");
    expect(screen.getByRole("button", {name: "auth.back_to_sign_in"}).getAttribute("href")).toBe("/");

    fireEvent.click(screen.getByRole("button", {name: "reset_password.expired.resend"}));

    expect(await screen.findByRole("heading", {level: 1, name: "reset_password.resent.title"})).toBeTruthy();
    expect(resendResetLink.mock.calls[0][0]).toBe("link-token");
    expect(screen.getByText("ol***@alvo.com").className).toContain("text-primary-500");
    expect(screen.getByRole("status").textContent).toBe("reset_password.resent.alert");
    expect(screen.getByRole("button", {name: "auth.sign_in_with_new_password"}).getAttribute("href")).toBe("/");
  });

  it("replaces the expiry note with the error when resending fails", async () => {
    resendResetLink.mockRejectedValue(createHttpError(503));
    await reachExpiredScreen();

    fireEvent.click(screen.getByRole("button", {name: "reset_password.expired.resend"}));

    await waitFor(() => expect(screen.getByRole("alert").textContent).toBe("auth.errors.service_unavailable"));
    expect(screen.queryByRole("note")).toBeNull();
  });

  it("treats a link without a token as expired and sends the user to request a new one", async () => {
    renderRoute(ResetPasswordPage, "/reset-password");

    expect(await screen.findByRole("heading", {level: 1, name: "reset_password.expired.title"})).toBeTruthy();
    expect(screen.getByRole("button", {name: "reset_password.expired.resend"}).getAttribute("href")).toBe("/forgot-password");
  });
});
