import {useState} from "react";
import {X} from "lucide-react";
import {cn} from "cnfast";
import {Dialog, DialogBackdrop, DialogPopup, DialogPortal} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import {useTopUpMutation} from "@/queries/use-wallet-queries";
import {GatewayDialog} from "@/components/new-shipment/gateway-dialog";
import {formatNaira} from "@/lib/format-naira";
import type {BankAccount, TopupMethod} from "@/types/wallet-types";
import {AccountDetails} from "./account-details";
import {SetupTopupPrompt, TopupWarning} from "./quick-topup-card";

const AMOUNTS = [5000, 10000, 50000, 100000];

const METHOD_TABS: {id: TopupMethod; label: () => string}[] = [
  {id: "bank_transfer", label: m["wallet.method_bank"]},
  {id: "debit_card", label: m["wallet.method_card"]},
  {id: "online", label: m["wallet.method_online"]},
];

function AmountPicker({amount, onChange}: {amount: number; onChange: (amount: number) => void}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <p className="text-base leading-[1.4] tracking-[0.16px] text-black opacity-60">{m["wallet.select_amount"]()}</p>
      <div className="flex items-center gap-2">
        {AMOUNTS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            aria-pressed={amount === preset}
            className={cn(
              "flex flex-col items-center justify-center rounded px-3 py-1.5 text-xs leading-[1.4] font-medium tracking-[0.12px]",
              amount === preset ? "bg-primary-500 text-white" : "border border-grey-300 text-black"
            )}
          >
            ₦{formatNaira(preset)}
          </button>
        ))}
      </div>
      <label className="flex h-10 w-full items-center rounded-lg border-[0.75px] border-grey-300 px-4">
        <span className="text-sm leading-[1.4] tracking-[0.14px] text-black">₦</span>
        <input
          inputMode="numeric"
          value={amount === 0 ? "" : formatNaira(amount)}
          onChange={(event) => onChange(Number(event.target.value.replace(/\D/g, "")) || 0)}
          aria-label={m["wallet.select_amount"]()}
          className="w-full text-sm leading-[1.4] tracking-[0.14px] text-black outline-none"
        />
      </label>
    </div>
  );
}

function MethodTabs({method, onChange}: {method: TopupMethod; onChange: (method: TopupMethod) => void}) {
  return (
    <div className="flex h-[54px] w-full items-center" role="tablist" aria-label={m["wallet.payment_method"]()}>
      {METHOD_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={method === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex h-full flex-1 items-center justify-center border-b-2 text-sm leading-[1.4] tracking-[0.14px]",
            method === tab.id ? "border-primary-500 font-medium text-primary-500" : "border-grey-300 text-grey-600"
          )}
        >
          {tab.label()}
        </button>
      ))}
    </div>
  );
}

function MethodPane({
  method,
  amount,
  account,
  onGenerate,
  onPay,
}: {
  method: TopupMethod;
  amount: number;
  account: BankAccount | null;
  onGenerate: () => void;
  onPay: () => void;
}) {
  if (method === "bank_transfer") {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-2 overflow-clip rounded-xl bg-grey-100 p-4">
        {account ? (
          <>
            <AccountDetails account={account} variant="stacked" />
            <TopupWarning />
          </>
        ) : (
          <SetupTopupPrompt onGenerate={onGenerate} />
        )}
      </div>
    );
  }
  return (
    <div className="flex w-full flex-col items-center gap-4 rounded-xl bg-grey-100 p-4">
      <p className="text-center text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{m["wallet.instant_notice"]()}</p>
      <button
        type="button"
        onClick={onPay}
        disabled={amount <= 0}
        className="flex h-[38px] w-full items-center justify-center rounded-lg bg-primary-500 px-3 py-2 text-base leading-[1.4] font-medium tracking-[0.32px] text-white disabled:opacity-50"
      >
        {m["wallet.pay_amount"]({amount: formatNaira(amount)})}
      </button>
    </div>
  );
}

/** Dialog body — remounts with the popup, so amount/method reset on every open. */
function TopupDialogBody({account, onClose, onGenerate, onComplete}: Omit<TopupDialogProps, "open"> & {onComplete: () => void}) {
  const topUp = useTopUpMutation();
  const [amount, setAmount] = useState(5000);
  const [method, setMethod] = useState<TopupMethod>("bank_transfer");
  const [gatewayOpen, setGatewayOpen] = useState(false);

  const onGatewayComplete = () => {
    topUp.mutate({amount, method}, {onSuccess: onComplete});
  };

  return (
    <>
      <div className="flex w-full items-center gap-2.5">
        <p className="flex-1 text-lg leading-[1.2] font-medium text-black">{m["wallet.topup"]()}</p>
        <button type="button" onClick={onClose} aria-label={m["pay.cancel"]()} className="size-6 text-grey-600">
          <X className="size-6" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-6 flex w-full flex-col gap-6">
        <AmountPicker amount={amount} onChange={setAmount} />
        <div className="flex w-full flex-col gap-2">
          <p className="text-base leading-[1.4] tracking-[0.16px] text-black opacity-60">{m["wallet.payment_method"]()}</p>
          <MethodTabs method={method} onChange={setMethod} />
          <MethodPane method={method} amount={amount} account={account} onGenerate={onGenerate} onPay={() => setGatewayOpen(true)} />
        </div>
      </div>
      <GatewayDialog open={gatewayOpen} onComplete={onGatewayComplete} />
    </>
  );
}

interface TopupDialogProps {
  open: boolean;
  onClose: () => void;
  account: BankAccount | null;
  onGenerate: () => void;
}

/** "Top up wallet" dialog: preset/custom amount + payment-method tabs. */
export function TopupDialog({open, onClose, account, onGenerate}: TopupDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => (next ? undefined : onClose())}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="flex w-[396px] flex-col p-6">
          <TopupDialogBody account={account} onClose={onClose} onGenerate={onGenerate} onComplete={onClose} />
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
