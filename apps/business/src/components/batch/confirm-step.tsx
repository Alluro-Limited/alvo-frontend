import {Button} from "@alvo/ui";
import {Link} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import {formatNaira} from "@/lib/format-naira";
import {useDashboardOverview} from "@/queries/use-dashboard-queries";
import {MethodOption} from "@/components/new-shipment/method-option";
import {PriceBreakdown} from "./price-breakdown";
import type {useBatchWizard} from "./use-batch-wizard";
import payOnlineUrl from "@/assets/pay-online.svg";
import payWalletUrl from "@/assets/pay-wallet.svg";

function WalletShortfall({balance, shortfall}: {balance: number; shortfall: number}) {
  return (
    <div className="flex w-full items-center justify-between gap-3 rounded-lg bg-status-fail-subtle px-4 py-3">
      <span className="flex flex-col">
        <span className="text-xs leading-[1.4] font-medium tracking-[0.12px] text-status-fail">
          {m["wiz.wallet_balance"]({amount: `₦${formatNaira(balance)}`})}
        </span>
        <span className="text-xs leading-[1.4] font-medium tracking-[0.12px] text-status-fail">
          {m["wiz.shortfall"]({amount: `₦${formatNaira(shortfall)}`})}
        </span>
      </span>
      <Button variant="outline" render={<Link to="/wallet" />} nativeButton={false}>
        {m["pay.topup"]()}
      </Button>
    </div>
  );
}

/** Step 4: price breakdown, wallet sufficiency, payment method, and terms. */
export function ConfirmStep({wizard}: {wizard: ReturnType<typeof useBatchWizard>}) {
  const {data: overview} = useDashboardOverview();
  const balance = overview?.walletBalance ?? 0;
  const {payment, recipients} = wizard;
  const insufficient = payment.method === "wallet" && balance < recipients.cost.total;

  return (
    <div className="flex w-full flex-col gap-6 p-6">
      <div className="flex w-full flex-col gap-1">
        <h2 className="text-lg leading-[1.2] font-medium text-black">{m["wiz.pay_title"]()}</h2>
        <p className="text-xs leading-[1.4] tracking-[0.12px] text-black opacity-50">{m["wiz.pay_sub"]()}</p>
      </div>
      <PriceBreakdown cost={recipients.cost} />
      {insufficient && <WalletShortfall balance={balance} shortfall={recipients.cost.total - balance} />}
      <div className="flex w-full flex-col gap-3">
        <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{m["wiz.method"]()}</p>
        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label={m["wiz.method"]()}>
          <MethodOption
            icon={payWalletUrl}
            title={m["pay.wallet"]()}
            sub={`₦${formatNaira(balance)}`}
            selected={payment.method === "wallet"}
            onSelect={() => payment.setMethod("wallet")}
          />
          <MethodOption
            icon={payOnlineUrl}
            title={m["pay.online"]()}
            sub={m["pay.online_sub"]()}
            selected={payment.method === "online"}
            onSelect={() => payment.setMethod("online")}
          />
        </div>
      </div>
      <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">
        {m["wiz.terms_pre"]()}
        <a href="/terms" className="font-medium text-primary-500 underline">
          {m["wiz.terms_link"]()}
        </a>
        {m["wiz.terms_post"]()}
      </p>
    </div>
  );
}
