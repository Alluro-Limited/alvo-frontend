import type {BankAccount, TopupMethod, WalletOverview, WalletService, WalletTransaction} from "@/types/wallet-types";
import {MOCK_AUTH} from "./mock-auth-service";
import {mockDelay, mockHttpError} from "./mock-http";
import {mockSession} from "./mock-session";

const DEMO_ACCOUNT: BankAccount = {bank: "Paystack Titans", accountNumber: "0123456789", accountName: "Apex Wears Ltd."};

const DEMO_TRANSACTIONS: WalletTransaction[] = [
  {
    id: "TXN-90011",
    kind: "topup",
    method: "bank_transfer",
    reference: "KS-20238-PAY",
    provider: "Paystack Titans",
    amount: 25000,
    date: "09/03/26 | 09:55 AM",
  },
  {
    id: "TXN-90010",
    kind: "batch_payment",
    batchId: "BT-20241",
    batchName: "March restock",
    shipmentCount: 96,
    amount: -15000,
    date: "13 Mar 2026 · 3:18 PM",
  },
  {
    id: "TXN-90009",
    kind: "batch_payment",
    batchId: "BT-20240",
    batchName: "Week 10 orders",
    shipmentCount: 44,
    amount: -5000,
    date: "10 Mar 2026 · 1:44 PM",
  },
  {
    id: "TXN-90008",
    kind: "topup",
    method: "debit_card",
    reference: "KS-20235-PAY",
    provider: "Mastercard ····4821",
    amount: 25000,
    date: "09/03/26 | 09:55 AM",
  },
  {
    id: "TXN-90007",
    kind: "topup",
    method: "bank_transfer",
    reference: "KS-20238-PAY",
    provider: "Paystack Titans",
    amount: 25000,
    date: "09/03/26 | 09:55 AM",
  },
];

const PROVIDER_BY_METHOD: Record<TopupMethod, string> = {
  bank_transfer: "Paystack Titans",
  debit_card: "Mastercard ····4821",
  online: "Paystack",
};

const isDemo = () => mockSession.email === MOCK_AUTH.demoEmail;

/** Accounts generated during the session, keyed by the signed-in email. */
const generatedAccounts = new Map<string, BankAccount>();
/** Transactions appended by mock top-ups, keyed by the signed-in email. */
const extraTransactions = new Map<string, WalletTransaction[]>();

/** In-memory wallet backend while the API does not exist. Never ships when `VITE_API_URL` is set. */
export const mockWalletService: WalletService = {
  getOverview: async (): Promise<WalletOverview> => {
    await mockDelay();
    const email = mockSession.email;
    const bankAccount = isDemo() ? DEMO_ACCOUNT : email ? (generatedAccounts.get(email) ?? null) : null;
    const transactions = [...(email ? (extraTransactions.get(email) ?? []) : []), ...(isDemo() ? DEMO_TRANSACTIONS : [])];
    return {
      balance: mockSession.walletBalance ?? 0,
      lastTopUpDate: transactions.length > 0 || isDemo() ? "14 Mar 2026" : null,
      bankAccount,
      transactions,
    };
  },
  generateAccount: async () => {
    await mockDelay(1500);
    if (mockSession.email === MOCK_AUTH.unavailableEmail) throw mockHttpError("wallet/account", 503);
    const email = mockSession.email ?? "unknown";
    const account: BankAccount = {bank: "Paystack", accountNumber: "0123456789", accountName: "Paystack Titans • Olanrewaju Quadri"};
    generatedAccounts.set(email, account);
    return account;
  },
  topUp: async (amount, method) => {
    await mockDelay();
    const transaction: WalletTransaction = {
      id: `TXN-${Math.floor(Math.random() * 90000) + 10000}`,
      kind: "topup",
      method,
      reference: `KS-${Math.floor(Math.random() * 90000) + 10000}-PAY`,
      provider: PROVIDER_BY_METHOD[method],
      amount,
      date: "16 Mar 2026 · 2:00 PM",
    };
    const email = mockSession.email;
    if (email) extraTransactions.set(email, [transaction, ...(extraTransactions.get(email) ?? [])]);
    mockSession.walletBalance = (mockSession.walletBalance ?? 0) + amount;
    return transaction;
  },
};
