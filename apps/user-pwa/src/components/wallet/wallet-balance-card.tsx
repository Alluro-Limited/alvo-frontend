import {Plus} from "lucide-react";
import {nairaExact} from "@/lib/money";
import {m} from "@/paraglide/messages";

/** The teal balance card at the top of the Wallet page, with the white "Top Up" pill. */
export function WalletBalanceCard({balance}: {balance: number}) {
  return (
    <div className="flex w-full items-center justify-between rounded-[16px] bg-primary-600 p-4">
      <div className="flex flex-col gap-1">
        <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-white/80">{m["wal.balance"]()}</span>
        <span className="text-[24px] font-bold leading-[1.2] tracking-[-0.24px] text-white">{nairaExact(balance)}</span>
      </div>
      <button
        type="button"
        className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-primary-600"
      >
        {m["wal.topup"]()}
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
