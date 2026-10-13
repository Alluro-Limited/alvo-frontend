import {fireEvent, screen} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {accountService} from "@/services/account-service";
import {renderRoute} from "@/test/render-route";
import type {VirtualAccount, WalletDetails} from "@/types/account-types";
import {TransactionsPage} from "../transactions";
import {WalletPage} from "../wallet";

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

const getWallet = vi.mocked(accountService.getWallet);
const generateAccount = vi.mocked(accountService.generateVirtualAccount);

const VIRTUAL: VirtualAccount = {number: "8716282918", bankName: "Paystack", accountName: "Paystack Titans • Olanrewaju Quadri"};

const WALLET: WalletDetails = {
  balance: 5420,
  virtualAccount: VIRTUAL,
  transactions: [
    {id: "t1", kind: "delivery", title: "Delivery #PKG1234", section: "Today", date: "Oct 22, 2024", amount: 700, status: "successful"},
    {id: "t2", kind: "topup", title: "Wallet Top-up", section: "Today", date: "Oct 22, 2024", amount: 5000, status: "successful"},
    {id: "t3", kind: "storage", title: "Storage #STR5678", section: "Yesterday", date: "Oct 22, 2024", amount: 5000, status: "successful"},
    {id: "t4", kind: "delivery", title: "Delivery #PKG1234", section: "Yesterday", date: "Oct 22, 2024", amount: 700, status: "successful"},
    {id: "t5", kind: "topup", title: "Wallet Top-up", section: "17/12/2025", date: "Oct 22, 2024", amount: 5000, status: "successful"},
  ],
};

describe("WalletPage", () => {
  beforeEach(() => {
    getWallet.mockReset().mockResolvedValue(WALLET);
    generateAccount.mockReset().mockResolvedValue(VIRTUAL);
  });

  it("renders the balance, virtual account, and the recent-transactions preview", async () => {
    renderRoute(WalletPage, "/account/wallet");
    expect(await screen.findByText("₦5,420.00")).toBeTruthy();
    expect(screen.getByText("wal.title")).toBeTruthy();
    expect(screen.getByText("wal.topup")).toBeTruthy();
    expect(screen.getByText("8716282918")).toBeTruthy();
    expect(screen.getByText("wal.recent")).toBeTruthy();
    // The preview caps at three rows — the fixture holds two top-ups but only one renders.
    expect(screen.getAllByText("Wallet Top-up")).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", {name: "wal.see_all"}));
    expect(await screen.findByText("stub:/account/transactions")).toBeTruthy();
  });

  it("generates a virtual account from the empty state", async () => {
    getWallet.mockResolvedValue({...WALLET, virtualAccount: null});
    renderRoute(WalletPage, "/account/wallet");
    fireEvent.click(await screen.findByRole("button", {name: "wal.generate"}));
    expect(await screen.findByRole("heading", {name: "wal.gen_title"})).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "wal.gen_cta"}));
    expect(await screen.findByRole("heading", {name: /wal.gen_done_title/})).toBeTruthy();
    expect(screen.getByText("Paystack")).toBeTruthy();
    expect(generateAccount).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", {name: "wal.done"}));
    expect(screen.queryByRole("heading", {name: "wal.gen_title"})).not.toBeTruthy();
  });

  it("shows the error state and navigates to support", async () => {
    getWallet.mockResolvedValue({...WALLET, virtualAccount: null});
    generateAccount.mockRejectedValue(new Error("down"));
    renderRoute(WalletPage, "/account/wallet");
    fireEvent.click(await screen.findByRole("button", {name: "wal.generate"}));
    fireEvent.click(screen.getByRole("button", {name: "wal.gen_cta"}));
    expect(await screen.findByRole("heading", {name: "wal.gen_fail"})).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "wal.contact"}));
    expect(await screen.findByText("stub:/support")).toBeTruthy();
  });
});

describe("TransactionsPage", () => {
  beforeEach(() => {
    getWallet.mockReset().mockResolvedValue(WALLET);
  });

  it("groups every transaction under its day section", async () => {
    renderRoute(TransactionsPage, "/account/transactions");
    // The first group ("Today") renders unlabeled — the divider only appears between groups.
    expect(await screen.findByText("Yesterday")).toBeTruthy();
    expect(screen.getByText("tx.title")).toBeTruthy();
    expect(screen.getByText("17/12/2025")).toBeTruthy();
    expect(screen.getAllByText("Delivery #PKG1234")).toHaveLength(2);
    expect(screen.getAllByText("Wallet Top-up")).toHaveLength(2);
  });
});
