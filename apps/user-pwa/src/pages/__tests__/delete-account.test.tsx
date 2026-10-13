import {fireEvent, screen} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {accountService} from "@/services/account-service";
import {createHttpError} from "@/test/http-error";
import {renderRoute} from "@/test/render-route";
import {DeleteAccountPage} from "../delete-account";

vi.mock("@/services/account-service", () => ({
  accountService: {
    getAccount: vi.fn(),
    updateName: vi.fn(),
    sendPhoneVerification: vi.fn(),
    verifyPhone: vi.fn(),
    getAddresses: vi.fn(),
    addAddress: vi.fn(),
    removeAddress: vi.fn(),
    requestAccountDeletion: vi.fn(),
    resendDeletionCode: vi.fn(),
    confirmAccountDeletion: vi.fn(),
    getWallet: vi.fn(),
    generateVirtualAccount: vi.fn(),
  },
}));

const requestDeletion = vi.mocked(accountService.requestAccountDeletion);
const resendCode = vi.mocked(accountService.resendDeletionCode);
const confirmDeletion = vi.mocked(accountService.confirmAccountDeletion);

/** Fills the password box and ticks both consent checkboxes. */
function completeForm() {
  fireEvent.change(screen.getByLabelText("del.password"), {target: {value: "Password1"}});
  fireEvent.click(screen.getByRole("checkbox", {name: "del.c1"}));
  fireEvent.click(screen.getByRole("checkbox", {name: "del.c2"}));
}

describe("DeleteAccountPage", () => {
  beforeEach(() => {
    requestDeletion.mockReset().mockResolvedValue(undefined);
    resendCode.mockReset().mockResolvedValue(undefined);
    confirmDeletion.mockReset().mockResolvedValue(undefined);
  });

  it("keeps the button disabled until password and both consents are set", async () => {
    renderRoute(DeleteAccountPage, "/account/delete");
    expect(await screen.findByText("del.includes")).toBeTruthy();
    const button = screen.getByRole("button", {name: "del.confirm"}) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    completeForm();
    expect(button.disabled).toBe(false);
  });

  it("surfaces a wrong password and still opens the OTP sheet after retry", async () => {
    requestDeletion.mockRejectedValueOnce(createHttpError(400, {code: "invalid_password"}));
    renderRoute(DeleteAccountPage, "/account/delete");
    expect(await screen.findByText("del.includes")).toBeTruthy();
    completeForm();
    fireEvent.click(await screen.findByRole("button", {name: "del.confirm"}));
    expect(await screen.findByText("del.err_password")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "del.confirm"}));
    expect(await screen.findByRole("heading", {name: "del.otp_title"})).toBeTruthy();
  });

  it("confirms deletion through the 5-digit code", async () => {
    renderRoute(DeleteAccountPage, "/account/delete");
    expect(await screen.findByText("del.includes")).toBeTruthy();
    completeForm();
    fireEvent.click(await screen.findByRole("button", {name: "del.confirm"}));
    expect(await screen.findByRole("heading", {name: "del.otp_title"})).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "del.otp_resend"}));
    await vi.waitFor(() => expect(resendCode).toHaveBeenCalled());
    confirmDeletion.mockRejectedValueOnce(createHttpError(400, {code: "invalid_code"}));
    fireEvent.change(screen.getByLabelText("auth.code_label"), {target: {value: "11111"}});
    fireEvent.click(screen.getByRole("button", {name: "del.otp_confirm"}));
    expect(await screen.findByText("del.otp_err")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("auth.code_label"), {target: {value: "55555"}});
    fireEvent.click(screen.getByRole("button", {name: "del.otp_confirm"}));
    await vi.waitFor(() => expect(confirmDeletion).toHaveBeenCalledWith("55555"));
    expect(await screen.findByText("stub:/sign-in")).toBeTruthy();
  });
});
