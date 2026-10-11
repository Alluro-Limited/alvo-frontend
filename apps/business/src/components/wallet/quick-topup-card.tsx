import topupSetupUrl from "@/assets/topup-setup.svg";
import {m} from "@/paraglide/messages";
import type {BankAccount} from "@/types/wallet-types";
import {AccountDetails} from "./account-details";

/** The bank-building illustration inside its grey circle, reused by the dialogs. */
export function TopupSetupIcon() {
  return (
    <span className="relative flex size-16 shrink-0 items-center justify-center rounded-full bg-grey-100">
      <img src={topupSetupUrl} alt="" aria-hidden="true" className="h-6 w-[42px]" />
    </span>
  );
}

/** Shared "no transfer account yet" prompt — used by the quick-topup card and the dialog. */
export function SetupTopupPrompt({onGenerate}: {onGenerate: () => void}) {
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <TopupSetupIcon />
      <div className="flex w-full flex-col text-center">
        <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{m["wallet.setup_title"]()}</p>
        <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{m["wallet.setup_sub"]()}</p>
      </div>
      <button
        type="button"
        onClick={onGenerate}
        className="flex h-[38px] items-center justify-center gap-2 rounded-lg px-3 py-2 text-base leading-[1.4] font-medium tracking-[0.32px] whitespace-nowrap text-primary-500"
      >
        {m["wallet.generate_account"]()}
      </button>
    </div>
  );
}

/** Shared warning strip shown wherever the transfer account details appear. */
export function TopupWarning() {
  return (
    <div className="flex w-full flex-col rounded-xl bg-status-warning-subtle p-3">
      <p className="text-xs leading-[1.4] tracking-[0.24px] text-status-warning-dark">{m["wallet.auto_update_notice"]()}</p>
    </div>
  );
}

interface QuickTopupCardProps {
  account: BankAccount | null;
  onGenerate: () => void;
}

/** Left column: transfer account details once generated, else the setup prompt. */
export function QuickTopupCard({account, onGenerate}: QuickTopupCardProps) {
  return (
    <div className="flex w-[356px] shrink-0 flex-col gap-4 overflow-clip rounded-md">
      <div className="flex flex-col gap-1">
        <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-[#070d17]">{m["wallet.quick_title"]()}</p>
        <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{m["wallet.quick_sub"]()}</p>
      </div>
      {account ? (
        <div className="flex w-full flex-col gap-2">
          <AccountDetails account={account} />
          <TopupWarning />
        </div>
      ) : (
        <div className="flex w-full flex-col items-center justify-center rounded-xl border-[0.75px] border-grey-300 bg-white p-6">
          <SetupTopupPrompt onGenerate={onGenerate} />
        </div>
      )}
    </div>
  );
}
