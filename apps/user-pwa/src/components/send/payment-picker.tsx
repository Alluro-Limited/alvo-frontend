import type {ReactNode} from "react";
import {Check, Globe, Wallet} from "lucide-react";
import {cn} from "cnfast";
import type {PaymentChannel} from "@/types/send-types";
import {m} from "@/paraglide/messages";

interface PaymentPickerProps {
  channel: PaymentChannel | null;
  /** Wallet balance in naira, from the quote. */
  walletBalance: number | null;
  onChange: (channel: PaymentChannel) => void;
}

/** "Payment Channel" — Wallet vs Pay Online radio rows. */
export function PaymentPicker({channel, walletBalance, onChange}: PaymentPickerProps) {
  return (
    <div className="flex w-full flex-col gap-5">
      <p className="text-[16px] font-medium leading-[1.4] tracking-[0.16px] text-[#070d17]">{m["send.pay_channel"]()}</p>
      <div className="flex w-full flex-col gap-4" role="radiogroup" aria-label={m["send.pay_channel"]()}>
        <ChannelOption
          selected={channel === "wallet"}
          icon={<Wallet className="size-6" aria-hidden="true" />}
          label={m["send.wallet"]()}
          sub={walletBalance !== null ? `₦${walletBalance.toFixed(2)}` : ""}
          onPick={() => onChange("wallet")}
        />
        <ChannelOption
          selected={channel === "online"}
          icon={<Globe className="size-6" aria-hidden="true" />}
          label={m["send.online"]()}
          sub={m["send.online_sub"]()}
          onPick={() => onChange("online")}
        />
      </div>
    </div>
  );
}

function ChannelOption({
  selected,
  icon,
  label,
  sub,
  onPick,
}: {
  selected: boolean;
  icon: ReactNode;
  label: string;
  sub: string;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onPick}
      className="flex w-full items-center justify-between text-left"
    >
      <span className="flex items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-[8px] bg-grey-100 p-1.5 text-foreground">{icon}</span>
        <span className="flex flex-col text-[#070d17]">
          <span className="text-[14px] font-medium leading-[1.4] tracking-[0.14px]">{label}</span>
          <span className="text-[10px] leading-[1.4] tracking-[0.1px] opacity-50">{sub}</span>
        </span>
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "flex size-[22px] items-center justify-center rounded-full border",
          selected ? "border-primary-500 bg-primary-500 text-white" : "border-grey-300 bg-white"
        )}
      >
        {selected ? <Check className="size-3" strokeWidth={3} aria-hidden="true" /> : null}
      </span>
    </button>
  );
}
