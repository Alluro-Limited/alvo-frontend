import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {authService} from "@/services/auth-service";
import {createHttpError} from "@/test/http-error";
import {renderRoute} from "@/test/render-route";
import {ResetPasswordPage} from "../reset-password";

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

const requestReset = vi.mocked(authService.requestPasswordReset);
const verifyCode = vi.mocked(authService.verifyResetCode);
const resetPassword = vi.mocked(authService.resetPassword);

const otpField = () => screen.getByLabelText("auth.code_label");

async function reachCodeStep() {
  renderRoute(ResetPasswordPage, "/reset-password");
  await screen.findByRole("heading", {name: "rp.title"});
  fireEvent.change(screen.getByLabelText("su.email"), {target: {value: "ola@example.com"}});
  fireEvent.click(screen.getByRole("button", {name: "rp.send"}));
  await screen.findByRole("heading", {name: "rp.check_title"});
}

describe("ResetPasswordPage", () => {
  beforeEach(() => {
    for (const fn of [requestReset, verifyCode, resetPassword]) fn.mockReset().mockResolvedValue(undefined);
  });

  it("keeps Send Code disabled until the email is valid", async () => {
    renderRoute(ResetPasswordPage, "/reset-password");
    await screen.findByRole("heading", {name: "rp.title"});
    fireEvent.click(screen.getByRole("button", {name: "rp.send"}));
    expect(requestReset).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText("su.email"), {target: {value: "not-an-email"}});
    fireEvent.click(screen.getByRole("button", {name: "rp.send"}));
    expect(requestReset).not.toHaveBeenCalled();
  });

  it("shows the masked email on the check-email step and resends", async () => {
    await reachCodeStep();
    await waitFor(() => expect(requestReset).toHaveBeenCalledWith("ola@example.com"));
    expect(screen.getByText("o***@example.com")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", {name: "rp.resend"}));
    await waitFor(() => expect(requestReset).toHaveBeenCalledTimes(2));
    expect(await screen.findByRole("button", {name: "rp.resent"})).toBeTruthy();
  });

  it("shows the wrong-code error and keeps the code step", async () => {
    verifyCode.mockRejectedValue(createHttpError(400));
    await reachCodeStep();
    fireEvent.change(otpField(), {target: {value: "00001"}});
    fireEvent.click(screen.getByRole("button", {name: "rp.verify"}));
    expect(await screen.findByText("su.code_wrong")).toBeTruthy();
    expect(screen.getByRole("heading", {name: "rp.check_title"})).toBeTruthy();
  });

  it("walks the whole flow to Password Updated and back to sign-in", async () => {
    await reachCodeStep();
    fireEvent.change(otpField(), {target: {value: "12345"}});
    fireEvent.click(screen.getByRole("button", {name: "rp.verify"}));
    await screen.findByRole("heading", {name: "rp.new_title"});

    fireEvent.click(screen.getByRole("button", {name: "rp.update"}));
    expect(resetPassword).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText("rp.new_label"), {target: {value: "NewPassword1"}});
    fireEvent.click(screen.getByRole("button", {name: "rp.update"}));
    await waitFor(() => expect(resetPassword).toHaveBeenCalledWith("NewPassword1"));

    expect(await screen.findByText("rp.done")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "rp.back_signin"}));
    expect(await screen.findByText("stub:/sign-in")).toBeTruthy();
  });

  it("goes back from code to the email step, then to sign-in", async () => {
    await reachCodeStep();
    fireEvent.click(screen.getByRole("button", {name: "auth.back"}));
    expect(await screen.findByRole("heading", {name: "rp.title"})).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "auth.back"}));
    expect(await screen.findByText("stub:/sign-in")).toBeTruthy();
  });
});
