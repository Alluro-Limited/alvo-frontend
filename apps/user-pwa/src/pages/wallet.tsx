import {useState} from "react";
import {useNavigate, useRouter} from "@tanstack/react-router";
import {ArrowLeft, Wallet} from "lucide-react";
import {GenerateAccountSheet} from "@/components/wallet/generate-account-sheet";
import {TransactionGroups} from "@/components/wallet/transaction-groups";
import {VirtualAccountCard} from "@/components/wallet/virtual-account-card";
import {WalletBalanceCard} from "@/components/wallet/wallet-balance-card";
import {useWalletQuery} from "@/queries/use-account-queries";
import {m} from "@/paraglide/messages";

/** Wallet — balance card, virtual funding account, and the recent-transactions preview. */
export function WalletPage() {
  const router = useRouter();
  const query = useWalletQuery();
  const [generating, setGenerating] = useState(false);
  const wallet = query.data;

  return (
    <main className="flex h-dvh w-full flex-col gap-6 overflow-y-auto bg-white px-6 pb-[max(32px,env(safe-area-inset-bottom))] pt-[60px]">
      <div className="relative flex w-full items-center">
        <button
          type="button"
          onClick={() => router.history.back()}
          aria-label={m["nt.back"]()}
          className="flex size-8 items-center justify-center rounded-full bg-[#f2f2f2]"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
        </button>
        <h1 className="absolute inset-x-0 text-center text-[20px] font-medium leading-[1.2] text-foreground">{m["wal.title"]()}</h1>
      </div>
      {query.isLoading || !wallet ? (
        <div className="flex flex-col gap-4">
          <div className="skeleton h-24 w-full rounded-[16px]" />
          <div className="skeleton h-24 w-full rounded-[16px]" />
          <div className="skeleton h-40 w-full rounded-[16px]" />
        </div>
      ) : (
        <WalletBody
          balance={wallet.balance}
          account={wallet.virtualAccount}
          transactions={wallet.transactions}
          onGenerate={() => setGenerating(true)}
        />
      )}
      <GenerateAccountSheet open={generating} onClose={() => setGenerating(false)} />
    </main>
  );
}

interface WalletBodyProps {
  balance: number;
  account: Parameters<typeof VirtualAccountCard>[0]["account"];
  transactions: Parameters<typeof TransactionGroups>[0]["transactions"];
  onGenerate: () => void;
}

function WalletBody({balance, account, transactions, onGenerate}: WalletBodyProps) {
  const navigate = useNavigate();
  return (
    <>
      <WalletBalanceCard balance={balance} />
      <VirtualAccountCard account={account} onGenerate={onGenerate} />
      <div className="flex w-full items-center justify-between">
        <h2 className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-foreground">{m["wal.recent"]()}</h2>
        <button
          type="button"
          onClick={() => void navigate({to: "/account/transactions"})}
          className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500"
        >
          {m["wal.see_all"]()}
        </button>
      </div>
      {transactions.length === 0 ? (
        <div className="flex w-full flex-col items-center gap-2 pt-16 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-[#f2f2f2]">
            <Wallet className="size-7 text-grey-400" aria-hidden="true" />
          </span>
          <p className="text-[16px] font-bold leading-[1.4] tracking-[0.16px] text-foreground">{m["wal.empty_title"]()}</p>
          <p className="max-w-[260px] text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500">{m["wal.empty_desc"]()}</p>
        </div>
      ) : (
        <TransactionGroups transactions={transactions.slice(0, 3)} dividers={false} />
      )}
    </>
  );
}
