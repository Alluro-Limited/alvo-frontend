import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {walletService} from "@/services/wallet-service";
import {renderRoute} from "@/test/render-route";
import type {BankAccount, WalletOverview} from "@/types/wallet-types";
import {WalletPage} from "../wallet";

vi.mock("@/services/wallet-service", () => ({
  walletService: {getOverview: vi.fn(), generateAccount: vi.fn(), topUp: vi.fn()},
}));

const getOverview = vi.mocked(walletService.getOverview);
const generateAccount = vi.mocked(walletService.generateAccount);
const topUp = vi.mocked(walletService.topUp);

const ACCOUNT: BankAccount = {bank: "Paystack Titans", accountNumber: "0123456789", accountName: "Apex Wears Ltd."};

const EMPTY: WalletOverview = {balance: 0, lastTopUpDate: null, bankAccount: null, transactions: []};

const POPULATED: WalletOverview = {
  balance: 12500,
  lastTopUpDate: "14 Mar 2026",
  bankAccount: ACCOUNT,
  transactions: [
    {
      id: "TXN-1",
      kind: "topup",
      method: "bank_transfer",
      reference: "KS-20238-PAY",
      provider: "Paystack Titans",
      amount: 25000,
      date: "09/03/26 | 09:55 AM",
    },
    {
      id: "TXN-2",
      kind: "batch_payment",
      batchId: "BT-20241",
      batchName: "March restock",
      shipmentCount: 96,
      amount: -15000,
      date: "13 Mar 2026 · 3:18 PM",
    },
    {
      id: "TXN-3",
      kind: "topup",
      method: "debit_card",
      reference: "KS-20235-PAY",
      provider: "Mastercard ····4821",
      amount: 25000,
      date: "09/03/26 | 09:55 AM",
    },
  ],
};

const renderWallet = () => renderRoute(WalletPage, "/wallet");

describe("WalletPage", () => {
  beforeEach(() => {
    getOverview.mockReset();
    generateAccount.mockReset();
    topUp.mockReset();
  });

  it("shows the empty wallet state with the setup prompt", async () => {
    getOverview.mockResolvedValue(EMPTY);
    renderWallet();

    expect(await screen.findByText("wallet.available_balance")).toBeTruthy();
    expect(screen.getByText("0.00")).toBeTruthy();
    expect(screen.getByText("wallet.no_funds")).toBeTruthy();
    expect(screen.getByText("wallet.setup_title")).toBeTruthy();
    expect(screen.getByText("wallet.txn_empty_title")).toBeTruthy();
    expect(screen.getByText("wallet.txn_empty_sub")).toBeTruthy();
  });

  it("renders the populated balance, bank account, and transactions", async () => {
    getOverview.mockResolvedValue(POPULATED);
    renderWallet();

    expect(await screen.findByText("12,500.00")).toBeTruthy();
    expect(screen.getByText("wallet.last_topup")).toBeTruthy();
    expect(screen.getAllByText("Paystack Titans").length).toBeGreaterThan(0);
    expect(screen.getAllByText("+₦25,000").length).toBe(2);
    expect(screen.getByText("-₦15,000")).toBeTruthy();
    expect(screen.getByText("wallet.history_title")).toBeTruthy();
  });

  it("filters transactions to topups only", async () => {
    getOverview.mockResolvedValue(POPULATED);
    renderWallet();
    await screen.findByText("12,500.00");

    fireEvent.click(screen.getByRole("tab", {name: "wallet.txn_topups"}));
    expect(screen.queryByText("-₦15,000")).toBeNull();
    expect(screen.getAllByText("+₦25,000").length).toBe(2);
  });

  it("opens the topup dialog with amount chips and method tabs", async () => {
    getOverview.mockResolvedValue(POPULATED);
    renderWallet();
    await screen.findByText("12,500.00");

    fireEvent.click(screen.getByRole("button", {name: "wallet.topup_cta"}));
    expect(await screen.findByText("wallet.select_amount")).toBeTruthy();
    expect(screen.getByRole("tab", {name: "wallet.method_bank"}).getAttribute("aria-selected")).toBe("true");
    expect(screen.getAllByText("0123456789").length).toBeGreaterThan(0);
    expect(screen.getAllByText("wallet.auto_update_notice").length).toBe(2);
  });

  it("pays online through the gateway and closes", async () => {
    getOverview.mockResolvedValue(POPULATED);
    topUp.mockResolvedValue(POPULATED.transactions[0]);
    renderWallet();
    await screen.findByText("12,500.00");

    fireEvent.click(screen.getByRole("button", {name: "wallet.topup_cta"}));
    fireEvent.click(await screen.findByRole("tab", {name: "wallet.method_online"}));
    fireEvent.click(screen.getByRole("button", {name: /wallet\.pay_amount/}));

    expect(await screen.findByText("pay.gateway_caption")).toBeTruthy();
    await waitFor(() => expect(topUp).toHaveBeenCalledWith(5000, "online"), {timeout: 4000});
  });

  it("walks through the generate-account flow to the ready state", async () => {
    getOverview.mockResolvedValue(EMPTY);
    generateAccount.mockResolvedValue(ACCOUNT);
    renderWallet();
    await screen.findByText("wallet.setup_title");

    fireEvent.click(screen.getAllByRole("button", {name: "wallet.generate_account"})[0]);
    expect(await screen.findByText("wallet.gen_title")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "wallet.generate_account"}));

    expect(await screen.findByText("wallet.ready_title")).toBeTruthy();
    expect(screen.getByText("0123456789")).toBeTruthy();
    expect(screen.getByRole("button", {name: "wallet.copy_account"})).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "wallet.done"}));
    expect(screen.queryByText("wallet.ready_title")).toBeNull();
  });

  it("shows the failure pane and retries when generation fails", async () => {
    getOverview.mockResolvedValue(EMPTY);
    generateAccount.mockRejectedValueOnce(new Error("boom")).mockResolvedValue(ACCOUNT);
    renderWallet();
    await screen.findByText("wallet.setup_title");

    fireEvent.click(screen.getAllByRole("button", {name: "wallet.generate_account"})[0]);
    fireEvent.click(await screen.findByRole("button", {name: "wallet.generate_account"}));

    expect(await screen.findByText("wallet.fail_title")).toBeTruthy();
    expect(screen.getByRole("button", {name: "wallet.contact_support"})).toBeTruthy();

    fireEvent.click(screen.getByRole("button", {name: "wallet.retry"}));
    expect(await screen.findByText("wallet.ready_title")).toBeTruthy();
  });
});
