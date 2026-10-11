import {Copy} from "lucide-react";
import {useState} from "react";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {BankAccount} from "@/types/wallet-types";

interface AccountDetailsProps {
  account: BankAccount;
  /**
   * `rows` is the quick-topup card layout (label left, value right);
   * `stacked` is the dialog layout (small label above the value, copy button).
   */
  variant?: "rows" | "stacked";
}

function Row({label, value}: {label: string; value: string}) {
  return (
    <div className="flex w-full items-center gap-2.5">
      <p className="flex-1 text-xs leading-[1.4] tracking-[0.24px] text-grey-600">{label}</p>
      <p className="text-sm leading-[1.4] font-medium tracking-[0.28px] text-black">{value}</p>
    </div>
  );
}

function StackedRow({label, value, copyable}: {label: string; value: string; copyable?: boolean}) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    void navigator.clipboard?.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <div className="flex w-full flex-col">
      <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{label}</p>
      <div className="flex items-center justify-between">
        <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{value}</p>
        {copyable && (
          <button type="button" onClick={copy} aria-label={m["wallet.copy_number"]()} className="text-primary-500">
            <Copy className="size-4" aria-hidden="true" />
            {copied && <span className="sr-only">{m["wallet.copied"]()}</span>}
          </button>
        )}
      </div>
    </div>
  );
}

/** The dedicated bank-transfer account shown in the quick-topup card and the dialogs. */
export function AccountDetails({account, variant = "rows"}: AccountDetailsProps) {
  return (
    <div className={cn("flex w-full flex-col rounded-xl", variant === "rows" ? "gap-6 bg-white px-3 py-6" : "gap-4")}>
      {variant === "rows" ? (
        <>
          <Row label={m["wallet.bank"]()} value={account.bank} />
          <Row label={m["wallet.account_number"]()} value={account.accountNumber} />
          <Row label={m["wallet.account_name"]()} value={account.accountName} />
        </>
      ) : (
        <>
          <StackedRow label={m["wallet.bank_name"]()} value={account.bank} />
          <StackedRow label={m["wallet.account_number"]()} value={account.accountNumber} copyable />
          <StackedRow label={m["wallet.account_name"]()} value={account.accountName} />
        </>
      )}
    </div>
  );
}
