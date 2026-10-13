import type {AccountData, AccountService, SavedAddress, WalletDetails, WalletTransaction} from "@/types/account-types";
import {MOCK_AUTH} from "./mock-auth-service";
import {mockDelay, mockHttpError} from "./mock-http";

/** Inputs that drive each designed state in the Personal Information sheets. */
export const MOCK_ACCOUNT = {
  /** The only phone that is already taken ("Phone Number Already Used"). */
  phoneInUse: "08012345678",
  /** The only SMS code that verifies. */
  phoneCode: "555555",
  /** The only code that confirms account deletion (5 digits, matching the design). */
  deleteCode: "55555",
} as const;

const ADDRESSES: SavedAddress[] = [
  {id: "sa-1", name: "Ikeja City Mall", address: "Obafemi Awolowo Way, Ikeja, Lagos State"},
  {id: "sa-2", name: "Lekki Mall Node", address: "Second Entrance, Lekki Mall Node, Lagos State"},
  {id: "sa-3", name: "Victoria Island Mall", address: "Main Entrance, Victoria Island, Lagos State"},
  {id: "sa-4", name: "Ikeja City Mall", address: "Ground Floor, Alausa, Ikeja, Lagos State"},
];

function txn(input: {id: string; kind: WalletTransaction["kind"]; title: string; section: string; amount: number}): WalletTransaction {
  return {...input, date: "Oct 22, 2024", status: "successful"};
}

const WALLET: WalletDetails = {
  balance: 5420,
  virtualAccount: {number: "8716282918", bankName: "Paystack", accountName: "Paystack Titans • Olanrewaju Quadri"},
  transactions: [
    txn({id: "t1", kind: "delivery", title: "Delivery #PKG1234", section: "Today", amount: 700}),
    txn({id: "t2", kind: "topup", title: "Wallet Top-up", section: "Today", amount: 5000}),
    txn({id: "t3", kind: "storage", title: "Storage #STR5678", section: "Today", amount: 5000}),
    txn({id: "t4", kind: "delivery", title: "Delivery #PKG1234", section: "Yesterday", amount: 700}),
    txn({id: "t5", kind: "topup", title: "Wallet Top-up", section: "Yesterday", amount: 5000}),
    txn({id: "t6", kind: "storage", title: "Storage #STR5678", section: "Yesterday", amount: 5000}),
    txn({id: "t7", kind: "delivery", title: "Delivery #PKG1234", section: "17/12/2025", amount: 700}),
    txn({id: "t8", kind: "topup", title: "Wallet Top-up", section: "17/12/2025", amount: 5000}),
    txn({id: "t9", kind: "storage", title: "Storage #STR5678", section: "17/12/2025", amount: 5000}),
  ],
};

const DATA: AccountData = {
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

/** In-memory stand-in for the backend while it does not exist. Never ships when `VITE_API_URL` is set. */
export const mockAccountService: AccountService = {
  getAccount: async () => {
    await mockDelay();
    return DATA;
  },
  updateName: async (firstName, lastName) => {
    await mockDelay();
    DATA.profile.firstName = firstName;
    DATA.profile.lastName = lastName;
    DATA.profile.name = `${lastName} ${firstName}`;
  },
  sendPhoneVerification: async (phone) => {
    await mockDelay();
    if (phone === MOCK_ACCOUNT.phoneInUse) {
      throw mockHttpError("users/account/phone/verify/send", 400, {code: "phone_in_use"});
    }
    DATA.profile.phone = phone;
  },
  verifyPhone: async (code) => {
    await mockDelay();
    if (code !== MOCK_ACCOUNT.phoneCode) {
      throw mockHttpError("users/account/phone/verify", 400, {code: "invalid_code"});
    }
  },
  getAddresses: async () => {
    await mockDelay();
    return ADDRESSES;
  },
  addAddress: async (node) => {
    await mockDelay();
    if (!ADDRESSES.some((a) => a.id === node.id)) {
      ADDRESSES.push({id: node.id, name: node.name, address: node.address});
    }
  },
  removeAddress: async (id) => {
    await mockDelay();
    const index = ADDRESSES.findIndex((a) => a.id === id);
    if (index >= 0) ADDRESSES.splice(index, 1);
  },
  requestAccountDeletion: async (password) => {
    await mockDelay();
    if (password !== MOCK_AUTH.password) {
      throw mockHttpError("users/account/delete/request", 400, {code: "invalid_password"});
    }
  },
  resendDeletionCode: async () => {
    await mockDelay();
  },
  confirmAccountDeletion: async (code) => {
    await mockDelay();
    if (code !== MOCK_ACCOUNT.deleteCode) {
      throw mockHttpError("users/account/delete", 400, {code: "invalid_code"});
    }
  },
  getWallet: async () => {
    await mockDelay();
    return WALLET;
  },
  generateVirtualAccount: async () => {
    await mockDelay();
    WALLET.virtualAccount = {number: "8716282918", bankName: "Paystack", accountName: "Paystack Titans • Olanrewaju Quadri"};
    return WALLET.virtualAccount;
  },
};
