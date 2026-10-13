import type {AccountService, BankAccount, CourierProfile, NotificationPrefs, SupportContact} from "@/types/earnings-types";
import {mockDelay, mockHttpError} from "./mock-http";
import {mockSession} from "./mock-session";

const PROFILE: CourierProfile = {
  name: "Olanrewaju Quadri",
  courierId: "CRR-00284",
  email: "olatunji@Alvo.com",
  phone: "08012345678",
  avatarUrl: null,
  vehicle: "motorcycle",
};

const SUPPORT: SupportContact = {
  team: "Courier Support",
  availability: "Available 6 AM – 10 PM",
  phone: "08012345678",
  email: "courier@company.com",
};

const BANK_ACCOUNT: BankAccount = {
  bankName: "Zenith Bank",
  accountNumber: "2210096123",
  accountName: "Olanrewaju Quadri O.",
};

const BANKS = [
  "Access Bank",
  "First Bank of Nigeria",
  "Guaranty Trust Bank",
  "Kuda Microfinance Bank",
  "Moniepoint Microfinance Bank",
  "OPay Digital Services",
  "PalmPay",
  "Stanbic IBTC Bank",
  "Sterling Bank",
  "United Bank for Africa",
  "Union Bank of Nigeria",
  "Zenith Bank",
];

const NOTIFICATION_PREFS: NotificationPrefs = {
  jobs: true,
  payments: true,
  admin: true,
};

/** Same convention as the sign-in mock — 12345 is the valid one-time code. */
const DELETE_CODE = "12345";

/** In-memory stand-in for the profile/support backend while it does not exist. */
export const mockAccountService: AccountService = {
  getProfile: async () => {
    await mockDelay(300);
    return {...PROFILE};
  },
  getSupportContact: async () => {
    await mockDelay(300);
    return {...SUPPORT};
  },
  signOut: async () => {
    await mockDelay(300);
    mockSession.phone = null;
  },
  requestDeleteCode: () => mockDelay(400),
  deleteAccount: async (code) => {
    await mockDelay(600);
    if (code !== DELETE_CODE) throw mockHttpError("courier/account/delete", 400, {code: "INVALID_CODE"});
    mockSession.phone = null;
  },
  requestVehicleChange: () => mockDelay(600),
  getBankAccount: async () => {
    await mockDelay(300);
    return {...BANK_ACCOUNT};
  },
  getBanks: async () => {
    await mockDelay(300);
    return [...BANKS];
  },
  requestBankChange: () => mockDelay(600),
  getNotificationPrefs: async () => {
    await mockDelay(300);
    return {...NOTIFICATION_PREFS};
  },
  setNotificationPref: async (key, enabled) => {
    await mockDelay(300);
    NOTIFICATION_PREFS[key] = enabled;
  },
};
