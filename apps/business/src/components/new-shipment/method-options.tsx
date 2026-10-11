import {Link} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import {formatNaira} from "@/lib/format-naira";
import type {PaymentMethod} from "@/types/shipment-types";
import {MethodOption} from "./method-option";
import payOnlineUrl from "@/assets/pay-online.svg";
import payWalletUrl from "@/assets/pay-wallet.svg";

interface MethodOptionsProps {
  walletBalance: number;
  insufficient: boolean;
  method: PaymentMethod | null;
  onMethodChange: (method: PaymentMethod) => void;
}

/** Wallet and online-payment radio options, including the insufficient-balance strip. */
export function MethodOptions({walletBalance, insufficient, method, onMethodChange}: MethodOptionsProps) {
  return (
    <div className="flex w-full flex-col gap-3" role="radiogroup" aria-label={m["pay.title"]()}>
      <div className="flex w-full flex-col">
        <MethodOption
          icon={payWalletUrl}
          title={m["pay.wallet"]()}
          sub={`₦${formatNaira(walletBalance)}`}
          selected={method === "wallet"}
          onSelect={() => onMethodChange("wallet")}
        />
        {insufficient && (
          <div className="flex items-center justify-between gap-2 rounded-b bg-status-fail-subtle px-3 py-2">
            <p className="text-xs leading-[1.4] font-medium tracking-[0.12px] text-status-fail">{m["pay.insufficient"]()}</p>
            <Link to="/wallet" className="text-xs leading-[1.4] font-bold tracking-[0.12px] text-status-fail">
              {m["pay.topup"]()}
            </Link>
          </div>
        )}
      </div>
      <MethodOption
        icon={payOnlineUrl}
        title={m["pay.online"]()}
        sub={m["pay.online_sub"]()}
        selected={method === "online"}
        onSelect={() => onMethodChange("online")}
      />
    </div>
  );
}
