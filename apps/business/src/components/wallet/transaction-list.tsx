import {useMemo, useState} from "react";
import {cn} from "cnfast";
import txnBatchUrl from "@/assets/txn-batch.svg";
import txnTopupUrl from "@/assets/txn-topup.svg";
import walletEmptyUrl from "@/assets/wallet-empty.svg";
import {m} from "@/paraglide/messages";
import {formatNaira} from "@/lib/format-naira";
import type {TopupMethod, TransactionFilter, WalletTransaction} from "@/types/wallet-types";

const FILTER_CHIPS: {id: TransactionFilter; label: () => string}[] = [
  {id: "all", label: m["wallet.txn_all"]},
  {id: "topup", label: m["wallet.txn_topups"]},
  {id: "batch_payment", label: m["wallet.txn_batches"]},
];

const METHOD_LABEL: Record<TopupMethod, () => string> = {
  bank_transfer: m["wallet.method_bank"],
  debit_card: m["wallet.method_card"],
  online: m["wallet.method_online"],
};

function transactionTitle(txn: WalletTransaction) {
  if (txn.kind === "topup") {
    return m["wallet.txn_topup"]({method: txn.method ? METHOD_LABEL[txn.method]() : ""});
  }
  return m["wallet.txn_batch"]({id: txn.batchId ?? ""});
}

function transactionDetail(txn: WalletTransaction) {
  if (txn.kind === "topup") {
    return m["wallet.txn_topup_sub"]({ref: txn.reference ?? "", provider: txn.provider ?? ""});
  }
  return m["wallet.txn_batch_sub"]({count: txn.shipmentCount ?? 0, name: txn.batchName ?? ""});
}

function TransactionRow({txn}: {txn: WalletTransaction}) {
  const isTopup = txn.kind === "topup";
  return (
    <div className="flex w-full items-start border-b-[0.5px] border-grey-300 py-4 last:border-b-0">
      <div className="flex min-w-px flex-1 items-start gap-2">
        <span className="flex aspect-square items-center justify-center self-stretch rounded bg-white p-1">
          <img src={isTopup ? txnTopupUrl : txnBatchUrl} alt="" aria-hidden="true" className="size-6" />
        </span>
        <div className="flex min-w-px flex-1 flex-col">
          <div className="flex w-full items-center justify-between text-sm tracking-[0.14px]">
            <p className="font-medium text-black">{transactionTitle(txn)}</p>
            <p className={cn("font-bold whitespace-nowrap", isTopup ? "text-status-success" : "text-status-fail")}>
              {isTopup ? "+" : "-"}₦{formatNaira(Math.abs(txn.amount))}
            </p>
          </div>
          <div className="flex w-full items-center justify-between text-xs tracking-[0.12px] whitespace-nowrap">
            <p className="text-grey-600">{transactionDetail(txn)}</p>
            <p className="text-grey-500">{txn.date}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyTransactions({onTopUp}: {onTopUp: () => void}) {
  return (
    <div className="flex w-[342px] flex-col items-center gap-6">
      <div className="flex w-full flex-col items-center gap-4">
        <img src={walletEmptyUrl} alt="" aria-hidden="true" className="size-[68px]" />
        <div className="w-[294px] text-center">
          <p className="text-base leading-[1.4] font-medium tracking-[0.16px] text-grey-600">{m["wallet.txn_empty_title"]()}</p>
          <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{m["wallet.txn_empty_sub"]()}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onTopUp}
        className="flex h-[38px] items-center justify-center gap-2 rounded-lg px-3 py-2 text-base leading-[1.4] font-medium tracking-[0.32px] whitespace-nowrap text-primary-500"
      >
        {m["wallet.topup"]()}
      </button>
    </div>
  );
}

interface TransactionListProps {
  transactions: WalletTransaction[];
  onTopUp: () => void;
}

/** Right column: "Transaction history" + "See all", filter chips, and the transaction card. */
export function TransactionList({transactions, onTopUp}: TransactionListProps) {
  const [filter, setFilter] = useState<TransactionFilter>("all");
  const filtered = useMemo(() => transactions.filter((txn) => filter === "all" || txn.kind === filter), [transactions, filter]);
  return (
    <div className="flex min-w-px flex-1 flex-col gap-4">
      <div className="flex w-full items-center gap-2.5 text-sm leading-[1.4] font-medium tracking-[0.14px]">
        <p className="flex-1 text-[#070d17]">{m["wallet.history_title"]()}</p>
        <p className="text-right text-primary-500">{m["wallet.see_all"]()}</p>
      </div>
      <div className="flex items-center gap-2" role="tablist" aria-label={m["wallet.history_title"]()}>
        {FILTER_CHIPS.map((chip) => (
          <button
            key={chip.id}
            type="button"
            role="tab"
            aria-selected={filter === chip.id}
            onClick={() => setFilter(chip.id)}
            className={cn(
              "flex flex-col items-center justify-center rounded px-3 py-1.5 text-xs leading-[1.4] font-medium tracking-[0.12px]",
              filter === chip.id ? "bg-primary-500 text-white" : "border border-grey-300 text-black"
            )}
          >
            {chip.label()}
          </button>
        ))}
      </div>
      <div
        className={cn(
          "flex w-full flex-col overflow-clip rounded-xl border-[0.75px] border-grey-300 bg-white px-4",
          filtered.length === 0 && "min-h-[483px] items-center justify-center"
        )}
      >
        {filtered.length === 0 ? <EmptyTransactions onTopUp={onTopUp} /> : filtered.map((txn) => <TransactionRow key={txn.id} txn={txn} />)}
      </div>
    </div>
  );
}
