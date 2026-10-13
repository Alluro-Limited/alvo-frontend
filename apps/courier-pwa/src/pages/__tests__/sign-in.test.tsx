import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {authService} from "@/services/auth-service";
import {createHttpError} from "@/test/http-error";
import {renderRoute} from "@/test/render-route";
import {SignInPage} from "../sign-in";

vi.mock("@/services/auth-service", () => ({
  authService: {requestLoginOtp: vi.fn(), resendLoginOtp: vi.fn(), verifyLoginOtp: vi.fn()},
}));

const requestOtp = vi.mocked(authService.requestLoginOtp);
const resendOtp = vi.mocked(authService.resendLoginOtp);
const verify = vi.mocked(authService.verifyLoginOtp);

const continueButton = () => screen.getByRole("button", {name: "auth.continue"});
const otpField = () => screen.getByLabelText("auth.code_label");

async function reachVerifyStep() {
  renderRoute(SignInPage, "/sign-in");
  fireEvent.change(await screen.findByLabelText("su.phone"), {target: {value: "8012345678"}});
  fireEvent.click(continueButton());
  await screen.findByText("auth.verify_title");
}

describe("SignInPage", () => {
  beforeEach(() => {
    requestOtp.mockReset().mockResolvedValue(undefined);
    resendOtp.mockReset().mockResolvedValue(undefined);
    verify.mockReset().mockResolvedValue(undefined);
  });

  it("validates the phone number before requesting a code", async () => {
    renderRoute(SignInPage, "/sign-in");
    expect(await screen.findByText("auth.welcome")).toBeTruthy();
    fireEvent.click(continueButton());
    expect(await screen.findByText("su.err_phone")).toBeTruthy();
    expect(requestOtp).not.toHaveBeenCalled();
  });

  it("shows the no-account error when the backend says 404", async () => {
    requestOtp.mockRejectedValue(createHttpError(404));
    renderRoute(SignInPage, "/sign-in");
    fireEvent.change(await screen.findByLabelText("su.phone"), {target: {value: "0000000000"}});
    fireEvent.click(continueButton());
    expect(await screen.findByText("auth.err_unknown_phone")).toBeTruthy();
  });

  it("moves to the verification step with the masked phone", async () => {
    await reachVerifyStep();
    expect(requestOtp).toHaveBeenCalledWith("8012345678");
    expect(screen.getByText(/XXX XXX 5678/)).toBeTruthy();
  });

  it("auto-submits the fifth digit and lands on /home", async () => {
    await reachVerifyStep();
    fireEvent.change(otpField(), {target: {value: "12345"}});
    await waitFor(() => expect(verify).toHaveBeenCalledWith("8012345678", "12345"));
    expect(await screen.findByText("stub:/home", {}, {timeout: 4000})).toBeTruthy();
  });

  it("shows the wrong-code error on a 400", async () => {
    verify.mockRejectedValue(createHttpError(400));
    await reachVerifyStep();
    fireEvent.change(otpField(), {target: {value: "00001"}});
    expect(await screen.findByText("auth.err_code")).toBeTruthy();
  });

  it("shows the lockout alert on a 429", async () => {
    verify.mockRejectedValue(createHttpError(429));
    await reachVerifyStep();
    fireEvent.change(otpField(), {target: {value: "00001"}});
    expect(await screen.findByText("auth.too_many")).toBeTruthy();
  });

  it("resends the code, shows the toast, and starts the countdown", async () => {
    await reachVerifyStep();
    fireEvent.click(screen.getByRole("button", {name: "auth.resend"}));
    await waitFor(() => expect(resendOtp).toHaveBeenCalledWith("8012345678"));
    expect(await screen.findByText("auth.code_resent")).toBeTruthy();
    expect(await screen.findByText(/auth.resend_in/)).toBeTruthy();
    expect(screen.queryByRole("button", {name: "auth.resend"})).toBeNull();
  });

  it("goes back from verification to the phone step, then to onboarding", async () => {
    await reachVerifyStep();
    fireEvent.click(screen.getByRole("button", {name: "nav.back"}));
    expect(await screen.findByText("auth.welcome")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "nav.back"}));
    expect(await screen.findByText("stub:/onboarding")).toBeTruthy();
  });
});
