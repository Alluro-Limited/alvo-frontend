import {Wallet} from "lucide-react";
import {m} from "@/paraglide/messages";

interface WalletCardProps {
  balance: number;
}

/** The teal wallet-balance hero at the top of the Earnings tab. */
export function WalletCard({balance}: WalletCardProps) {
  return (
    <section className="rounded-[8px] bg-primary-500 p-6">
      <p className="flex items-center gap-1 text-[12px] font-medium text-white">
        <Wallet className="size-4" aria-hidden="true" />
        {m["earnings.wallet"]()}
      </p>
      <p className="mt-1 text-[28px] leading-[34px] font-medium text-white">{`₦${balance.toLocaleString("en-US")}`}</p>
    </section>
  );
}
