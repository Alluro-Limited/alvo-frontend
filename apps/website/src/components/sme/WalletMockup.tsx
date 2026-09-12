import {Copy, Package, Wallet} from "lucide-react";

import {smeFeatureTabsContent} from "@/content/sme";
import {MockupFrame} from "./MockupFrame";

function WalletField({label, value}: {label: string; value: string}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-grey-600">{label}</span>
      <span className="text-sm font-medium text-black">{value}</span>
    </div>
  );
}

type Transaction = (typeof smeFeatureTabsContent.mockups.wallet.transactions)[number];

function WalletTransactions({transactions}: {transactions: readonly Transaction[]}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-grey-200 bg-white p-4">
      {transactions.map((tx) => (
        <div key={tx.title} className="flex items-start gap-3 border-b border-grey-200 pb-3 last:border-0 last:pb-0">
          <div
            className={`flex size-8 shrink-0 items-center justify-center rounded ${
              tx.type === "credit" ? "bg-success-50 text-success-600" : "bg-danger-50 text-danger-500"
            }`}
          >
            {tx.type === "credit" ? <Wallet className="size-4" /> : <Package className="size-4" />}
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-black">{tx.title}</span>
              <span className={`whitespace-nowrap text-sm font-bold ${tx.type === "credit" ? "text-status-success" : "text-status-fail"}`}>
                {tx.amount}
              </span>
            </div>
            <div className="flex flex-col gap-0.5 text-xs text-grey-500 sm:flex-row sm:items-center sm:justify-between">
              <span>{tx.meta}</span>
              <span className="whitespace-nowrap">{tx.date}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function WalletDetails() {
  const content = smeFeatureTabsContent.mockups.wallet;
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-grey-200 bg-white p-4">
      <WalletField label="Bank name" value={content.bank} />
      <div className="flex items-center justify-between gap-4">
        <WalletField label="Account number" value={content.accountNumber} />
        <button type="button" aria-label="Copy account number" className="text-grey-500 hover:text-primary-500">
          <Copy className="size-4" />
        </button>
      </div>
      <WalletField label="Account name" value={content.accountName} />
    </div>
  );
}

export function WalletMockup() {
  const content = smeFeatureTabsContent.mockups.wallet;
  return (
    <MockupFrame tabs={content.tabs} activeTab={content.activeTab}>
      <div className="flex flex-col gap-5">
        <WalletDetails />
        <WalletTransactions transactions={content.transactions} />
      </div>
    </MockupFrame>
  );
}
