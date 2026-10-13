import {Package, Wallet} from "lucide-react";
import type {EarningTxn} from "@/types/earnings-types";

interface EarningRowProps {
  txn: EarningTxn;
}

/** One feed row: icon tile + title/amount line + subtitle/timestamp line. Credits teal, debits red. */
export function EarningRow({txn}: EarningRowProps) {
  const Icon = txn.kind === "withdrawal" ? Wallet : Package;
  const signed = `${txn.amount < 0 ? "-" : "+"}₦${Math.abs(txn.amount).toLocaleString("en-US")}`;
  return (
    <div className="flex items-start gap-2 border-b-[0.5px] border-grey-300 px-2 py-4 last:border-0">
      <span className="grid size-8 shrink-0 place-items-center rounded-[4px] bg-grey-100">
        <Icon className="size-5 text-grey-600" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-medium">{txn.title}</p>
          <p className={`text-[14px] font-bold ${txn.amount < 0 ? "text-status-fail-dark" : "text-primary-500"}`}>{signed}</p>
        </div>
        <div className="flex items-center justify-between text-[12px]">
          <p className="text-grey-600">{txn.subtitle}</p>
          <p className="text-grey-500">{txn.timestamp}</p>
        </div>
      </div>
    </div>
  );
}
