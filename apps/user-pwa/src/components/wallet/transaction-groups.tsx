import {TransactionRow} from "./transaction-row";
import type {WalletTransaction} from "@/types/account-types";

interface TransactionGroupsProps {
  transactions: WalletTransaction[];
  /** When false the first group's divider is hidden — the wallet page lists recents unlabeled. */
  dividers?: boolean;
}

/** Transactions bucketed by their `section` label, with centered day dividers between groups. */
export function TransactionGroups({transactions, dividers = true}: TransactionGroupsProps) {
  const groups: {label: string; items: WalletTransaction[]}[] = [];
  for (const txn of transactions) {
    const last = groups[groups.length - 1];
    if (last && last.label === txn.section) {
      last.items.push(txn);
    } else {
      groups.push({label: txn.section, items: [txn]});
    }
  }
  return (
    <div className="flex w-full flex-col gap-4">
      {groups.map((group, i) => (
        <section key={group.label} className="flex w-full flex-col">
          {dividers && i > 0 ? (
            <span className="pb-2 text-center text-[10px] leading-[1.4] tracking-[0.1px] text-grey-500">{group.label}</span>
          ) : null}
          {group.items.map((txn) => (
            <TransactionRow key={txn.id} txn={txn} />
          ))}
        </section>
      ))}
    </div>
  );
}
