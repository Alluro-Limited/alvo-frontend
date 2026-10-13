import {PageHeader} from "@/components/account/page-header";
import {TransactionGroups} from "@/components/wallet/transaction-groups";
import {useWalletQuery} from "@/queries/use-account-queries";
import {m} from "@/paraglide/messages";

/** Transaction History — the full wallet ledger grouped into day sections. */
export function TransactionsPage() {
  const query = useWalletQuery();

  return (
    <main className="flex h-dvh w-full flex-col gap-6 overflow-y-auto bg-white px-6 pb-[max(32px,env(safe-area-inset-bottom))] pt-[60px]">
      <PageHeader title={m["tx.title"]()} />
      {query.isLoading || !query.data ? (
        <div className="flex flex-col gap-2">
          <div className="skeleton h-14 w-full rounded-[12px]" />
          <div className="skeleton h-14 w-full rounded-[12px]" />
          <div className="skeleton h-14 w-full rounded-[12px]" />
        </div>
      ) : (
        <TransactionGroups transactions={query.data.transactions} />
      )}
    </main>
  );
}
