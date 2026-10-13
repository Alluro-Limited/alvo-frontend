import {fireEvent, screen} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {accountService} from "@/services/account-service";
import {createHttpError} from "@/test/http-error";
import {renderRoute} from "@/test/render-route";
import type {AccountData} from "@/types/account-types";
import {AccountPage} from "../account";
import {PersonalInfoPage} from "../personal-info";

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

const getAccount = vi.mocked(accountService.getAccount);
const updateName = vi.mocked(accountService.updateName);
const sendPhoneVerification = vi.mocked(accountService.sendPhoneVerification);
const verifyPhone = vi.mocked(accountService.verifyPhone);

const ACCOUNT: AccountData = {
  profile: {
    firstName: "Quadri",
    lastName: "Olanrewaju",
    name: "Olanrewaju Quadri",
    email: "olatunji@alvo.com",
    emailVerified: true,
    phone: null,
  },
  wallet: {
    balance: 5420,
    bank: {bankName: "Bank Name", accountNumber: "0123456789"},
  },
};

describe("AccountPage", () => {
  beforeEach(() => {
    getAccount.mockReset().mockResolvedValue(ACCOUNT);
  });

  it("renders the sections, wallet card, and footer", async () => {
    renderRoute(AccountPage, "/account");
    expect(await screen.findByText("₦5,420")).toBeTruthy();
    expect(screen.getByText("acct.title")).toBeTruthy();
    expect(screen.getByText("acct.personal_info")).toBeTruthy();
    expect(screen.getByText("acct.addresses")).toBeTruthy();
    expect(screen.getByText("acct.history")).toBeTruthy();
    expect(screen.getByText("acct.faqs")).toBeTruthy();
    expect(screen.getByText("acct.get_help")).toBeTruthy();
    expect(screen.getByText("acct.legal")).toBeTruthy();
    expect(screen.getByText("Bank Name")).toBeTruthy();
    expect(screen.getByText("0123456789")).toBeTruthy();
    expect(screen.getByText("acct.version")).toBeTruthy();
  });

  it("navigates to personal information and support", async () => {
    renderRoute(AccountPage, "/account");
    fireEvent.click(await screen.findByRole("button", {name: /acct.personal_info/}));
    expect(await screen.findByText("stub:/account/personal")).toBeTruthy();
  });

  it("opens the FAQs sheet and navigates to the financial/legal destinations", async () => {
    renderRoute(AccountPage, "/account");
    fireEvent.click(await screen.findByRole("button", {name: /acct.faqs/}));
    expect(await screen.findByRole("heading", {name: "faq.title"})).toBeTruthy();
    expect(screen.getByText(/faq.q1/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "loc.close"}));
    expect(screen.queryByRole("heading", {name: "faq.title"})).not.toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: /acct.get_help/}));
    expect(await screen.findByText("stub:/account/help")).toBeTruthy();
  });
});

describe("PersonalInfoPage", () => {
  beforeEach(() => {
    getAccount.mockReset().mockResolvedValue(ACCOUNT);
    updateName.mockReset().mockResolvedValue(undefined);
    sendPhoneVerification.mockReset().mockResolvedValue(undefined);
    verifyPhone.mockReset().mockResolvedValue(undefined);
  });

  it("renders the profile rows with edit and verified affordances", async () => {
    renderRoute(PersonalInfoPage, "/account/personal");
    expect(await screen.findByText("Olanrewaju Quadri")).toBeTruthy();
    expect(screen.getByText("pi.title")).toBeTruthy();
    expect(screen.getByText("olatunji@alvo.com")).toBeTruthy();
    expect(screen.getByText("pi.sign_out")).toBeTruthy();
    expect(screen.getByText("pi.delete")).toBeTruthy();
  });

  it("updates the name through the sheet", async () => {
    renderRoute(PersonalInfoPage, "/account/personal");
    fireEvent.click(await screen.findByRole("button", {name: /pi\.edit.*pi\.name|pi.name.*pi.edit/}));
    expect(await screen.findByRole("heading", {name: "pi.name_title"})).toBeTruthy();
    fireEvent.change(screen.getByLabelText("pi.first"), {target: {value: ""}});
    fireEvent.change(screen.getByLabelText("pi.last"), {target: {value: "Olanrewaju#"}});
    fireEvent.click(screen.getByRole("button", {name: "pi.save"}));
    expect(await screen.findByText("pi.first_empty")).toBeTruthy();
    expect(screen.getByText("pi.last_invalid")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("pi.first"), {target: {value: "Toye"}});
    fireEvent.change(screen.getByLabelText("pi.last"), {target: {value: "Akande"}});
    fireEvent.click(screen.getByRole("button", {name: "pi.save"}));
    await vi.waitFor(() => expect(updateName).toHaveBeenCalledWith("Toye", "Akande"));
    expect(await screen.findByText("pi.name_done")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "acc.done"}));
    expect(screen.queryByRole("heading", {name: "pi.name_title"})).not.toBeTruthy();
  });

  it("confirms sign out through the dialog", async () => {
    renderRoute(PersonalInfoPage, "/account/personal");
    fireEvent.click(await screen.findByRole("button", {name: /pi.sign_out/}));
    expect(await screen.findByText("out.title")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "out.stay"}));
    expect(screen.queryByText("out.title")).not.toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: /pi.sign_out/}));
    fireEvent.click(await screen.findByRole("button", {name: "out.confirm"}));
    expect(await screen.findByText("stub:/sign-in")).toBeTruthy();
  });

  it("navigates to the delete account page", async () => {
    renderRoute(PersonalInfoPage, "/account/personal");
    fireEvent.click(await screen.findByRole("button", {name: /pi.delete/}));
    expect(await screen.findByText("stub:/account/delete")).toBeTruthy();
  });

  it("verifies a new phone number through the OTP step", async () => {
    renderRoute(PersonalInfoPage, "/account/personal");
    fireEvent.click(await screen.findByRole("button", {name: /pi\.edit.*pi\.phone|pi.phone.*pi.edit/}));
    expect(await screen.findByRole("heading", {name: "pi.phone_title"})).toBeTruthy();
    fireEvent.change(screen.getByLabelText("pi.new_phone"), {target: {value: "123"}});
    fireEvent.click(screen.getByRole("button", {name: "pi.send_code"}));
    expect(await screen.findByText("pi.phone_format")).toBeTruthy();
    sendPhoneVerification.mockRejectedValueOnce(createHttpError(400, {code: "phone_in_use"}));
    fireEvent.change(screen.getByLabelText("pi.new_phone"), {target: {value: "08012345678"}});
    fireEvent.click(screen.getByRole("button", {name: "pi.send_code"}));
    expect(await screen.findByText("pi.phone_used")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("pi.new_phone"), {target: {value: "09012345678"}});
    fireEvent.click(screen.getByRole("button", {name: "pi.send_code"}));
    expect(await screen.findByRole("heading", {name: "pi.verify_title"})).toBeTruthy();
    expect(screen.getByText("+234 901 234 5678")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("auth.code_label"), {target: {value: "555555"}});
    fireEvent.click(screen.getByRole("button", {name: "acc.verify"}));
    expect(await screen.findByText("pi.phone_done")).toBeTruthy();
    expect(verifyPhone).toHaveBeenCalledWith("555555");
  });
});
