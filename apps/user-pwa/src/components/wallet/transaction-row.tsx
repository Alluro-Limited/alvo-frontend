import {Archive, Banknote, Truck} from "lucide-react";
import type {WalletTransaction} from "@/types/account-types";
import {nairaExact} from "@/lib/money";
import {m} from "@/paraglide/messages";

const KIND_ICONS = {delivery: Truck, topup: Banknote, storage: Archive} as const;

/** One wallet ledger row — tinted kind icon, title + date, signed amount + status. */
export function TransactionRow({txn}: {txn: WalletTransaction}) {
  const Icon = KIND_ICONS[txn.kind];
  const positive = txn.amount >= 0;
  return (
    <div className="flex w-full items-center gap-3 py-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e9fafb] text-primary-500">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-foreground">{txn.title}</span>
        <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500">{txn.date}</span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-0.5">
        <span className={`text-[14px] font-bold leading-[1.4] tracking-[0.14px] ${positive ? "text-foreground" : "text-status-fail"}`}>
          {positive ? "+" : "-"}
          {nairaExact(Math.abs(txn.amount))}
        </span>
        <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-status-ok">{m["wal.success"]()}</span>
      </span>
    </div>
  );
}
