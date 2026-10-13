import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {accountService} from "@/services/account-service";
import {renderRoute} from "@/test/render-route";
import type {BankAccount} from "@/types/earnings-types";
import {BankAccountPage} from "../bank-account";

vi.mock("@/services/account-service", () => ({
  accountService: {
    getProfile: vi.fn(),
    getSupportContact: vi.fn(),
    signOut: vi.fn(),
    requestDeleteCode: vi.fn(),
    deleteAccount: vi.fn(),
    requestVehicleChange: vi.fn(),
    getBankAccount: vi.fn(),
    getBanks: vi.fn(),
    requestBankChange: vi.fn(),
  },
}));

const getBankAccount = vi.mocked(accountService.getBankAccount);
const getBanks = vi.mocked(accountService.getBanks);
const requestBankChange = vi.mocked(accountService.requestBankChange);

const ACCOUNT: BankAccount = {bankName: "Zenith Bank", accountNumber: "2210096123", accountName: "Olanrewaju Quadri O."};
const BANKS = ["Access Bank", "Kuda Microfinance Bank", "Zenith Bank"];

const requestButton = () => screen.getByRole("button", {name: "bank.request"});

async function fillForm() {
  renderRoute(BankAccountPage, "/bank-account");
  expect(await screen.findByText("2210096123")).toBeTruthy();
  await screen.findByRole("option", {name: "Kuda Microfinance Bank"});
  fireEvent.change(screen.getByRole("combobox", {name: "bank.name"}), {target: {value: "Kuda Microfinance Bank"}});
  fireEvent.change(screen.getByLabelText("bank.number"), {target: {value: "1234567890"}});
  fireEvent.change(screen.getByLabelText("bank.account_name"), {target: {value: "Olanrewaju Quadri"}});
}

describe("BankAccountPage", () => {
  beforeEach(() => {
    getBankAccount.mockReset().mockResolvedValue(ACCOUNT);
    getBanks.mockReset().mockResolvedValue(BANKS);
    requestBankChange.mockReset().mockResolvedValue(undefined);
  });

  it("shows the current account card and the form", async () => {
    renderRoute(BankAccountPage, "/bank-account");
    expect(await screen.findByText("2210096123")).toBeTruthy();
    expect(screen.getByText(/Olanrewaju Quadri O\./)).toBeTruthy();
    expect(screen.getByText(/Zenith Bank/)).toBeTruthy();
    expect(screen.getByText("bank.current")).toBeTruthy();
    expect(screen.getByText("bank.title")).toBeTruthy();
  });

  it("keeps Request Change disabled until the form is complete", async () => {
    renderRoute(BankAccountPage, "/bank-account");
    await screen.findByText("2210096123");
    expect(requestButton()).toHaveProperty("disabled", true);
    await screen.findByRole("option", {name: "Kuda Microfinance Bank"});
    fireEvent.change(screen.getByRole("combobox", {name: "bank.name"}), {target: {value: "Kuda Microfinance Bank"}});
    fireEvent.change(screen.getByLabelText("bank.number"), {target: {value: "123"}});
    fireEvent.change(screen.getByLabelText("bank.account_name"), {target: {value: "Olanrewaju Quadri"}});
    expect(requestButton()).toHaveProperty("disabled", true);
    fireEvent.change(screen.getByLabelText("bank.number"), {target: {value: "1234567890"}});
    expect(requestButton()).toHaveProperty("disabled", false);
  });

  it("summarizes the new account in the warning sheet, then submits", async () => {
    await fillForm();
    fireEvent.click(requestButton());
    expect(await screen.findByText("bank.sheet_title")).toBeTruthy();
    expect(screen.getByText("bank.sheet_desc")).toBeTruthy();
    expect(screen.getByText("1234567890")).toBeTruthy();
    expect(screen.getByText("Olanrewaju Quadri")).toBeTruthy();
    const requests = screen.getAllByRole("button", {name: "bank.request"});
    fireEvent.click(requests[requests.length - 1]);
    await waitFor(() =>
      expect(requestBankChange).toHaveBeenCalledWith({
        bankName: "Kuda Microfinance Bank",
        accountNumber: "1234567890",
        accountName: "Olanrewaju Quadri",
      })
    );
    expect(await screen.findByText("bankd.title")).toBeTruthy();
    expect(screen.getByText("bankd.next")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "bankd.back"}));
    expect(await screen.findByText("stub:/profile")).toBeTruthy();
  });

  it("cancel in the sheet closes it without submitting", async () => {
    await fillForm();
    fireEvent.click(requestButton());
    fireEvent.click(await screen.findByRole("button", {name: "home.cancel"}));
    await waitFor(() => expect(screen.queryByText("bank.sheet_title")).toBeNull());
    expect(requestBankChange).not.toHaveBeenCalled();
    expect(screen.getByText("bank.title")).toBeTruthy();
  });
});
