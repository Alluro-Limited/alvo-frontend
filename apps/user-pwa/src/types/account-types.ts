/** The linked bank account card shown under Wallet Balance on the Account tab. */
export interface BankAccount {
  /** e.g. "Bank Name". */
  bankName: string;
  /** e.g. "0123456789". */
  accountNumber: string;
}

export interface WalletOverview {
  /** ₦ balance shown on the Wallet Balance row. */
  balance: number;
  /** The linked payout bank card — absent when none is connected. */
  bank: BankAccount | null;
}

/** The signed-in user's profile shown on Personal Information. */
export interface UserProfile {
  firstName: string;
  lastName: string;
  /** Display name rendered on the Name row ("Olanrewaju Quadri"). */
  name: string;
  email: string;
  /** Verified emails show the teal check instead of an edit pencil. */
  emailVerified: boolean;
  /** `null` renders "-" until a number is verified. */
  phone: string | null;
}

/** Everything the Account tab needs: profile + wallet. */
export interface AccountData {
  profile: UserProfile;
  wallet: WalletOverview;
}

/** A locker node saved on the Saved Addresses page. */
export interface SavedAddress {
  id: string;
  /** Node name, e.g. "Ikeja City Mall". */
  name: string;
  /** The full address line under the name. */
  address: string;
}

/** The node picked in the Address sheet — a `LockerNode` satisfies this shape. */
export type AddressCandidate = Pick<SavedAddress, "id" | "name" | "address">;

export type TransactionStatus = "successful" | "pending" | "failed";
export type TransactionKind = "delivery" | "topup" | "storage";

/** A wallet ledger row on the Wallet page and Transaction History. */
export interface WalletTransaction {
  id: string;
  /** e.g. "Delivery #PKG1234", "Wallet Top-up", "Storage #STR5678". */
  title: string;
  /** Drives the row icon. */
  kind: TransactionKind;
  /** e.g. "Oct 22, 2024". */
  date: string;
  /** The history-page group label, e.g. "Today", "Yesterday", "17/12/2025". */
  section: string;
  /** Signed ₦ amount — positive credits the wallet. */
  amount: number;
  status: TransactionStatus;
}

/** The generated bank account users transfer into to fund the wallet. */
export interface VirtualAccount {
  number: string;
  bankName: string;
  /** e.g. "Paystack Titans • Olanrewaju Quadri". */
  accountName: string;
}

/** Everything the Wallet page needs: balance, funding account, and the transaction ledger. */
export interface WalletDetails {
  balance: number;
  /** `null` renders the "Generate virtual account" state. */
  virtualAccount: VirtualAccount | null;
  /** Newest first; the page shows the first three, the history page all of them. */
  transactions: WalletTransaction[];
}

export interface AccountService {
  getAccount(): Promise<AccountData>;
  /** Saves first + last name; the display name updates on the next `getAccount`. */
  updateName(firstName: string, lastName: string): Promise<void>;
  /** Sends the 6-digit SMS code for a new number. Throws `phone_in_use` when taken. */
  sendPhoneVerification(phone: string): Promise<void>;
  /** Validates the SMS code and swaps the number. Throws `invalid_code` when wrong. */
  verifyPhone(code: string): Promise<void>;
  getAddresses(): Promise<SavedAddress[]>;
  /** Saves a locker node picked in the Address sheet. */
  addAddress(node: AddressCandidate): Promise<void>;
  removeAddress(id: string): Promise<void>;
  /** Step 1 — checks the password and sends the deletion code. Throws `invalid_password` when wrong. */
  requestAccountDeletion(password: string): Promise<void>;
  /** Resends the code from the Confirm account deletion sheet. */
  resendDeletionCode(): Promise<void>;
  /** Step 2 — verifies the code and deletes the account. Throws `invalid_code` when wrong. */
  confirmAccountDeletion(code: string): Promise<void>;
  getWallet(): Promise<WalletDetails>;
  /** Creates the virtual funding account; rejections land on the sheet's failure view. */
  generateVirtualAccount(): Promise<VirtualAccount>;
}
