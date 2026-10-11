export type TopupMethod = "bank_transfer" | "debit_card" | "online";
export type TransactionFilter = "all" | "topup" | "batch_payment";

export interface WalletTransaction {
  id: string;
  kind: "topup" | "batch_payment";
  /** Top-ups only: how the wallet was funded. */
  method?: TopupMethod;
  /** Top-ups only: payment reference, e.g. "KS-20238-PAY". */
  reference?: string;
  /** Top-ups only: processor label, e.g. "Paystack Titans". */
  provider?: string;
  /** Batch payments only. */
  batchId?: string;
  batchName?: string;
  shipmentCount?: number;
  /** Signed kobo-free amount — top-ups positive, batch payments negative. */
  amount: number;
  date: string;
}

/** The dedicated virtual account used for bank-transfer top-ups. */
export interface BankAccount {
  bank: string;
  accountNumber: string;
  accountName: string;
}

export interface WalletOverview {
  balance: number;
  lastTopUpDate: string | null;
  bankAccount: BankAccount | null;
  transactions: WalletTransaction[];
}

export interface WalletService {
  getOverview: () => Promise<WalletOverview>;
  generateAccount: () => Promise<BankAccount>;
  topUp: (amount: number, method: TopupMethod) => Promise<WalletTransaction>;
}
