import {useState} from "react";
import {CircleX} from "lucide-react";
import {cn} from "cnfast";
import {Dialog, DialogBackdrop, DialogPopup, DialogPortal} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import {useGenerateAccountMutation} from "@/queries/use-wallet-queries";
import type {BankAccount} from "@/types/wallet-types";
import {AccountDetails} from "./account-details";
import {TopupSetupIcon} from "./quick-topup-card";

type GenState = "confirm" | "generating" | "ready" | "failed";

const outlineBtn =
  "flex h-[38px] flex-1 items-center justify-center rounded-lg border border-primary-500 px-3 py-2 text-base leading-[1.4] font-medium tracking-[0.32px] text-primary-500";
const primaryBtn =
  "flex h-[38px] flex-1 items-center justify-center rounded-lg bg-primary-500 px-3 py-2 text-base leading-[1.4] font-medium tracking-[0.32px] text-white";

function DialogHeading({title, sub}: {title: string; sub: string}) {
  return (
    <div className="flex w-full flex-col text-center">
      <p className="text-lg leading-[1.2] font-medium text-black">{title}</p>
      <p className="mt-1 text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{sub}</p>
    </div>
  );
}

function ConfirmPane({onCancel, onGenerate}: {onCancel: () => void; onGenerate: () => void}) {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <TopupSetupIcon />
      <DialogHeading title={m["wallet.gen_title"]()} sub={m["wallet.gen_sub"]()} />
      <div className="flex w-full gap-2">
        <button type="button" onClick={onCancel} className={outlineBtn}>
          {m["pay.cancel"]()}
        </button>
        <button type="button" onClick={onGenerate} className={primaryBtn}>
          {m["wallet.generate_account"]()}
        </button>
      </div>
    </div>
  );
}

function GeneratingPane() {
  return (
    <div className="flex w-full flex-col items-center gap-4 py-4">
      <TopupSetupIcon />
      <span className="flex items-center gap-1.5" aria-hidden="true">
        {[0, 1, 2].map((dot) => (
          <span key={dot} className="size-1.5 animate-pulse rounded-full bg-grey-400" style={{animationDelay: `${dot * 150}ms`}} />
        ))}
      </span>
      <DialogHeading title={m["wallet.gen_working"]()} sub={m["wallet.gen_working_sub"]()} />
    </div>
  );
}

function ReadyPane({account, onDone}: {account: BankAccount; onDone: () => void}) {
  const copyNumber = () => void navigator.clipboard?.writeText(account.accountNumber);
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <TopupSetupIcon />
      <DialogHeading title={m["wallet.ready_title"]()} sub={m["wallet.ready_sub"]()} />
      <div className="w-full rounded-xl bg-grey-100 p-4">
        <AccountDetails account={account} variant="stacked" />
      </div>
      <button type="button" onClick={copyNumber} className={cn(primaryBtn, "w-full")}>
        {m["wallet.copy_account"]()}
      </button>
      <button type="button" onClick={onDone} className={cn(outlineBtn, "w-full")}>
        {m["wallet.done"]()}
      </button>
    </div>
  );
}

function FailedPane({onContact, onRetry}: {onContact: () => void; onRetry: () => void}) {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <CircleX className="size-12 text-status-fail" aria-hidden="true" />
      <DialogHeading title={m["wallet.fail_title"]()} sub={m["wallet.fail_sub"]()} />
      <div className="flex w-full gap-2">
        <button type="button" onClick={onContact} className={cn(outlineBtn, "border-grey-300 bg-grey-100 text-black")}>
          {m["wallet.contact_support"]()}
        </button>
        <button type="button" onClick={onRetry} className={primaryBtn}>
          {m["wallet.retry"]()}
        </button>
      </div>
    </div>
  );
}

/** Dialog body — remounts with the popup, so the flow always starts at confirm. */
function GenerateAccountBody({onClose}: {onClose: () => void}) {
  const mutation = useGenerateAccountMutation();
  const [state, setState] = useState<GenState>("confirm");
  const [account, setAccount] = useState<BankAccount | null>(null);

  const generate = () => {
    setState("generating");
    mutation.mutate(undefined, {
      onSuccess: (generated) => {
        setAccount(generated);
        setState("ready");
      },
      onError: () => setState("failed"),
    });
  };

  if (state === "generating") return <GeneratingPane />;
  if (state === "ready" && account) return <ReadyPane account={account} onDone={onClose} />;
  if (state === "failed") return <FailedPane onContact={onClose} onRetry={generate} />;
  return <ConfirmPane onCancel={onClose} onGenerate={generate} />;
}

/** The dedicated-account flow: confirm → generating → ready (or failed → retry). */
export function GenerateAccountDialog({open, onClose}: {open: boolean; onClose: () => void}) {
  return (
    <Dialog open={open} onOpenChange={(next) => (next ? undefined : onClose())}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="flex w-[396px] flex-col items-center p-6">
          <GenerateAccountBody onClose={onClose} />
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
