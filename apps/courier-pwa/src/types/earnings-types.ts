export type EarningTxnKind = "delivery" | "withdrawal";

/** One row in Earnings History / Recent Activity — a delivery credit or an auto-withdrawal. */
export interface EarningTxn {
  id: string;
  kind: EarningTxnKind;
  /** Job id for deliveries, "Auto-Withdrawal" for payouts. */
  title: string;
  /** "Regular" | "Speed Delivery" for deliveries, the bank mask for withdrawals. */
  subtitle: string;
  /** Signed kobo-free amount: positive credits, negative payouts. */
  amount: number;
  /** e.g. "09/03/26 | 09:55 AM". */
  timestamp: string;
}

export interface EarningsOverview {
  walletBalance: number;
  monthEarnings: number;
  monthJobs: number;
  recent: EarningTxn[];
}

export interface TransactionGroup {
  /** Divider label, e.g. "Yesterday" or "16/12/2025" — null for the leading (unlabeled) group. */
  dayLabel: string | null;
  items: EarningTxn[];
}

export type VehicleType = "bicycle" | "motorcycle" | "car" | "van";

export interface CourierProfile {
  name: string;
  courierId: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  vehicle: VehicleType;
}

export interface SupportContact {
  team: string;
  availability: string;
  phone: string;
  email: string;
}

/** Per-category notification switches on the Notification settings screen. */
export interface NotificationPrefs {
  jobs: boolean;
  payments: boolean;
  admin: boolean;
}

export type NotificationPrefKey = keyof NotificationPrefs;

/** The payout bank account — also the shape submitted by the change-request form. */
export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface EarningsService {
  getEarnings: () => Promise<EarningsOverview>;
  getHistory: () => Promise<TransactionGroup[]>;
}

export interface AccountService {
  getProfile: () => Promise<CourierProfile>;
  getSupportContact: () => Promise<SupportContact>;
  signOut: () => Promise<void>;
  /** Sends the one-time deletion code to the courier's registered channel. */
  requestDeleteCode: () => Promise<void>;
  deleteAccount: (code: string) => Promise<void>;
  /** Submits a vehicle change request — triggers the in-person assessment flow. */
  requestVehicleChange: (vehicle: VehicleType) => Promise<void>;
  getBankAccount: () => Promise<BankAccount>;
  /** The selectable bank list for the change form. */
  getBanks: () => Promise<string[]>;
  /** Submits a bank account change request — goes through name-match verification. */
  requestBankChange: (account: BankAccount) => Promise<void>;
  getNotificationPrefs: () => Promise<NotificationPrefs>;
  setNotificationPref: (key: NotificationPrefKey, enabled: boolean) => Promise<void>;
}
