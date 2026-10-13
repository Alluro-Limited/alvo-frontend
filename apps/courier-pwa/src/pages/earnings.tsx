import {Link} from "@tanstack/react-router";
import {EarningFeed} from "@/components/earnings/earning-feed";
import {MonthTiles} from "@/components/earnings/month-tiles";
import {PayoutBanner} from "@/components/earnings/payout-banner";
import {WalletCard} from "@/components/earnings/wallet-card";
import {m} from "@/paraglide/messages";
import {useEarningsQuery} from "@/queries/use-earnings-queries";

/** The Earnings tab: wallet balance, this-month tiles, payout explainer, recent activity. */
export function EarningsPage() {
  const query = useEarningsQuery();

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[430px] bg-white px-6 pt-[max(24px,env(safe-area-inset-top))] pb-[max(24px,env(safe-area-inset-bottom))]">
      <h1 className="text-[32px] leading-[36px] font-bold tracking-[-0.01em]">{m["nav.earnings"]()}</h1>
      {query.isPending || !query.data ? (
        <div className="mt-6 flex flex-col gap-4">
          <div className="h-[103px] animate-pulse rounded-[8px] bg-grey-100" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-[83px] animate-pulse rounded-[8px] bg-grey-100" />
            <div className="h-[83px] animate-pulse rounded-[8px] bg-grey-100" />
          </div>
          <div className="h-[79px] animate-pulse rounded-[8px] bg-grey-100" />
        </div>
      ) : (
        <>
          <div className="mt-6 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <WalletCard balance={query.data.walletBalance} />
              <MonthTiles earnings={query.data.monthEarnings} jobs={query.data.monthJobs} />
            </div>
            <PayoutBanner />
          </div>
          <div className="mt-6 flex items-baseline justify-between">
            <h2 className="text-[16px] font-semibold">{m["earnings.history"]()}</h2>
            <Link to="/earnings/history" className="text-[14px] font-medium text-primary-600">
              {m["job.see_all"]()}
            </Link>
          </div>
          <div className="mt-2">
            <EarningFeed txns={query.data.recent} />
          </div>
        </>
      )}
    </main>
  );
}
