import {useCallback, useRef, useState} from "react";
import {useSetHeaderAction} from "@/components/app-shell/header-action";
import {useSetPageTitle} from "@/components/app-shell/page-title";
import {BalanceCard} from "@/components/wallet/balance-card";
import {GenerateAccountDialog} from "@/components/wallet/generate-account-dialog";
import {QuickTopupCard} from "@/components/wallet/quick-topup-card";
import {TopupDialog} from "@/components/wallet/topup-dialog";
import {TransactionList} from "@/components/wallet/transaction-list";
import {m} from "@/paraglide/messages";
import {useWalletOverview} from "@/queries/use-wallet-queries";

function WalletSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[1100px] animate-pulse flex-col gap-8">
      <div className="h-[178px] rounded-lg bg-primary-500/20" />
      <div className="flex gap-4">
        <div className="h-[260px] w-[356px] rounded-xl border border-grey-200 bg-white" />
        <div className="h-[483px] flex-1 rounded-xl border border-grey-200 bg-white" />
      </div>
    </div>
  );
}

/** `/wallet` — balance banner, quick bank top-up, and the transaction history. */
export function WalletPage() {
  useSetPageTitle(m["nav.wallet"]());
  const {data: overview, isLoading} = useWalletOverview();
  const [topupOpen, setTopupOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const historyRef = useRef<HTMLDivElement>(null);

  const openTopup = useCallback(() => setTopupOpen(true), []);
  useSetHeaderAction(openTopup);

  if (isLoading || !overview) return <WalletSkeleton />;

  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-8">
      <BalanceCard
        balance={overview.balance}
        lastTopUpDate={overview.lastTopUpDate}
        onTopUp={openTopup}
        onViewHistory={() => historyRef.current?.scrollIntoView({behavior: "smooth"})}
      />
      <div className="flex items-start gap-4" ref={historyRef}>
        <QuickTopupCard account={overview.bankAccount} onGenerate={() => setGenerateOpen(true)} />
        <TransactionList transactions={overview.transactions} onTopUp={openTopup} />
      </div>
      <TopupDialog
        open={topupOpen}
        onClose={() => setTopupOpen(false)}
        account={overview.bankAccount}
        onGenerate={() => setGenerateOpen(true)}
      />
      <GenerateAccountDialog open={generateOpen} onClose={() => setGenerateOpen(false)} />
    </div>
  );
}
