import walletIconUrl from "@/assets/nav-wallet-white.svg";
import {m} from "@/paraglide/messages";
import {formatNaira} from "@/lib/format-naira";

interface BalanceCardProps {
  balance: number;
  lastTopUpDate: string | null;
  onTopUp: () => void;
  onViewHistory: () => void;
}

/** The full-width teal balance banner: label, amount, subtitle, and the two actions. */
export function BalanceCard({balance, lastTopUpDate, onTopUp, onViewHistory}: BalanceCardProps) {
  return (
    <section className="flex w-full flex-col items-start overflow-clip rounded-lg bg-primary-500 p-6">
      <div className="flex w-[419px] max-w-full flex-col justify-end gap-4">
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center gap-1">
            <img src={walletIconUrl} alt="" aria-hidden="true" className="size-4" />
            <p className="text-xs leading-[1.4] font-medium tracking-[0.12px] whitespace-nowrap text-white">
              {m["wallet.available_balance"]()}
            </p>
          </div>
          <p className="w-full tracking-[-0.28px] text-white">
            <span className="text-lg leading-[1.4] tracking-[0.18px]">₦</span>
            <span className="text-[28px] leading-[1.2] font-medium">
              {formatNaira(balance)}
              {balance === 0 ? "" : ".00"}
            </span>
          </p>
          <p className="text-xs leading-[1.4] font-medium tracking-[0.12px] whitespace-nowrap text-white opacity-70">
            {lastTopUpDate ? m["wallet.last_topup"]({date: lastTopUpDate}) : m["wallet.no_funds"]()}
          </p>
        </div>
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onTopUp}
            className="flex h-[38px] w-[116px] items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-base leading-[1.4] font-medium tracking-[0.32px] whitespace-nowrap text-primary-500"
          >
            {m["wallet.topup_cta"]()}
          </button>
          <button
            type="button"
            onClick={onViewHistory}
            className="flex h-[38px] items-center justify-center gap-2 rounded-lg border-[0.75px] border-white px-3 py-2 text-base leading-[1.4] font-medium tracking-[0.32px] whitespace-nowrap text-white"
          >
            {m["wallet.view_history"]()}
          </button>
        </div>
      </div>
    </section>
  );
}
