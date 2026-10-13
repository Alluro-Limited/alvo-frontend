import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {authService} from "@/services/auth-service";
import {createHttpError} from "@/test/http-error";
import {renderRoute} from "@/test/render-route";
import {SignUpPage} from "../sign-up";

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

const createAccount = vi.mocked(authService.createAccount);
const requestCode = vi.mocked(authService.requestVerificationCode);
const verifyCode = vi.mocked(authService.verifyCode);
const complete = vi.mocked(authService.completeRegistration);

const otpField = () => screen.getByLabelText("auth.code_label");

function fillDetails() {
  fireEvent.change(screen.getByLabelText("su.full_name"), {target: {value: "Olatunji Bakare"}});
  fireEvent.change(screen.getByLabelText("su.pref_name"), {target: {value: "Tunji"}});
  fireEvent.change(screen.getByLabelText("su.phone"), {target: {value: "8012345678"}});
  fireEvent.change(screen.getByLabelText("su.email"), {target: {value: "tunji@example.com"}});
}

async function reachMethodStep() {
  renderRoute(SignUpPage, "/sign-up");
  await screen.findByRole("heading", {name: "su.title"});
  fillDetails();
  fireEvent.click(screen.getByRole("button", {name: "su.next"}));
  fireEvent.click(await screen.findByRole("button", {name: "su.continue"}));
  await screen.findByRole("heading", {name: "su.verify_title"});
}

async function reachCodeStep() {
  await reachMethodStep();
  fireEvent.click(screen.getByRole("radio", {name: "su.via_email"}));
  fireEvent.click(screen.getByRole("button", {name: "su.continue"}));
  await screen.findByRole("heading", {name: "su.code_title"});
}

describe("SignUpPage", () => {
  beforeEach(() => {
    for (const fn of [createAccount, requestCode, verifyCode, complete]) fn.mockReset().mockResolvedValue(undefined);
  });

  it("keeps Next disabled until the details are valid", async () => {
    renderRoute(SignUpPage, "/sign-up");
    await screen.findByRole("heading", {name: "su.title"});
    fireEvent.click(screen.getByRole("button", {name: "su.next"}));
    expect(screen.queryByText("su.confirm_title")).toBeNull();
  });

  it("confirms the details, then creates the account", async () => {
    renderRoute(SignUpPage, "/sign-up");
    await screen.findByRole("heading", {name: "su.title"});
    fillDetails();
    fireEvent.click(screen.getByRole("button", {name: "su.next"}));

    expect(await screen.findByText("su.confirm_title")).toBeTruthy();
    expect(screen.getByText("tunji@example.com")).toBeTruthy();
    expect(screen.getByText("08012345678")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", {name: "su.continue"}));
    await waitFor(() => expect(createAccount).toHaveBeenCalled());
    expect(await screen.findByRole("heading", {name: "su.verify_title"})).toBeTruthy();
  });

  it("lets the user edit the details from the confirmation modal", async () => {
    renderRoute(SignUpPage, "/sign-up");
    await screen.findByRole("heading", {name: "su.title"});
    fillDetails();
    fireEvent.click(screen.getByRole("button", {name: "su.next"}));
    fireEvent.click(await screen.findByRole("button", {name: "su.edit"}));

    await waitFor(() => expect(screen.queryByText("su.confirm_title")).toBeNull());
    expect(createAccount).not.toHaveBeenCalled();
  });

  it("requires a method pick before continuing to the code step", async () => {
    await reachMethodStep();
    fireEvent.click(screen.getByRole("button", {name: "su.continue"}));
    expect(requestCode).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("radio", {name: "su.via_sms"}));
    fireEvent.click(screen.getByRole("button", {name: "su.continue"}));
    await waitFor(() => expect(requestCode).toHaveBeenCalledWith("sms"));
    expect(await screen.findByRole("heading", {name: "su.code_title"})).toBeTruthy();
    expect(screen.getByText("su.code_sms")).toBeTruthy();
  });

  it("shows the wrong-code error when verification fails", async () => {
    verifyCode.mockRejectedValue(createHttpError(400));
    await reachCodeStep();
    fireEvent.change(otpField(), {target: {value: "00001"}});
    expect(await screen.findByText("su.code_wrong")).toBeTruthy();
    expect(screen.queryByRole("heading", {name: "su.pw_title"})).toBeNull();
  });

  it("offers another verification method through the sheet", async () => {
    await reachCodeStep();
    fireEvent.click(screen.getByRole("button", {name: "su.try_another"}));
    fireEvent.click(await screen.findByRole("button", {name: /su.method_whatsapp/}));
    await waitFor(() => expect(requestCode).toHaveBeenCalledWith("whatsapp"));
  });

  it("completes the wizard to the You're All Set screen", async () => {
    await reachCodeStep();
    fireEvent.change(otpField(), {target: {value: "12345"}});
    await screen.findByRole("heading", {name: "su.pw_title"});

    fireEvent.click(screen.getByRole("button", {name: "su.complete"}));
    expect(complete).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText("su.pw_label"), {target: {value: "Password1"}});
    fireEvent.click(screen.getByRole("checkbox", {name: /su.agree_label/}));
    fireEvent.click(screen.getByRole("button", {name: "su.complete"}));
    await waitFor(() => expect(complete).toHaveBeenCalledWith("Password1"));
    expect(await screen.findByText("su.all_set")).toBeTruthy();
  });

  it("opens the location sheet from Find Nearby Lockers", async () => {
    await reachCodeStep();
    fireEvent.change(otpField(), {target: {value: "12345"}});
    await screen.findByRole("heading", {name: "su.pw_title"});
    fireEvent.change(screen.getByLabelText("su.pw_label"), {target: {value: "Password1"}});
    fireEvent.click(screen.getByRole("checkbox", {name: /su.agree_label/}));
    fireEvent.click(screen.getByRole("button", {name: "su.complete"}));

    fireEvent.click(await screen.findByRole("button", {name: "su.find_lockers"}));
    expect(await screen.findByText("su.loc_title")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "su.loc_later"}));
    await waitFor(() => expect(screen.queryByText("su.loc_title")).toBeNull());
  });
  it("shows the resend countdown on the code step", async () => {
    await reachCodeStep();
    expect(screen.getByText("su.resend_in")).toBeTruthy();
  });
});
