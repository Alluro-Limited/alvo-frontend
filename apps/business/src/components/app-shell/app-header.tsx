import {Link, useLocation} from "@tanstack/react-router";
import {Plus} from "lucide-react";
import {m} from "@/paraglide/messages";
import {useDashboardOverview} from "@/queries/use-dashboard-queries";
import {NotificationsBell} from "@/components/notifications/notifications-bell";
import {formatNaira} from "@/lib/format-naira";
import {useHeaderAction} from "./header-action";
import {navLabelForPath} from "./nav-config";
import {usePageTitle} from "./page-title";

function WalletBalance() {
  const {data: overview} = useDashboardOverview();
  return (
    <div className="flex items-center whitespace-nowrap">
      <p className="text-sm leading-[1.4] tracking-[0.14px] text-grey-600">{m["shell.wallet_balance"]()}</p>
      <p className="font-medium tracking-[-0.28px] text-primary-500">
        <span className="text-xs leading-[1.4] font-normal tracking-[0.12px]">₦</span>
        <span className="text-base leading-[1.4] tracking-[0.16px]">{formatNaira(overview?.walletBalance)}</span>
      </p>
    </div>
  );
}

/** The 64px white header: page title on the left, wallet balance + notifications (or the New batch CTA) on the right. */
export function AppHeader() {
  const {pathname} = useLocation();
  const pageTitle = usePageTitle();
  const title = pageTitle ?? navLabelForPath(pathname)?.() ?? m["shell.overview"]();
  const headerAction = useHeaderAction();
  const isBatchesSection = pathname === "/shipments" || pathname.startsWith("/shipments/");
  const isWalletSection = pathname === "/wallet";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b-[0.5px] border-grey-300 bg-white px-12">
      <p className="text-lg leading-[1.2] font-medium text-black">{title}</p>
      {isBatchesSection ? (
        <Link
          to="/new-shipment"
          className="flex h-[38px] items-center gap-2 rounded-lg bg-primary-500 px-3 py-2 text-base leading-[1.4] font-medium tracking-[0.32px] text-white"
        >
          <Plus className="size-[22px]" aria-hidden="true" />
          {m["batches.new_batch"]()}
        </Link>
      ) : isWalletSection ? (
        <button
          type="button"
          onClick={() => headerAction?.()}
          className="flex h-[38px] items-center gap-2 rounded-lg bg-primary-500 px-3 py-2 text-base leading-[1.4] font-medium tracking-[0.32px] text-white"
        >
          <Plus className="size-[22px]" aria-hidden="true" />
          {m["wallet.topup"]()}
        </button>
      ) : (
        <div className="flex items-center gap-8">
          <WalletBalance />
          <NotificationsBell />
        </div>
      )}
    </header>
  );
}
