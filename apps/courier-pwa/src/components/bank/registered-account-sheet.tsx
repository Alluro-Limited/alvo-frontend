import {Dialog, DialogBackdrop, DialogPopup, DialogPortal} from "@alvo/ui";
import registeredIcon from "@/assets/bank-registered.svg";
import {m} from "@/paraglide/messages";
import type {BankAccount} from "@/types/earnings-types";

interface RegisteredAccountSheetProps {
  account: BankAccount;
  open: boolean;
  pending: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

/** "Use Your Registered Account" warning sheet — summarizes the new account before submitting. */
export function RegisteredAccountSheet({account, open, pending, onConfirm, onClose}: RegisteredAccountSheetProps) {
  const rows = [
    {label: m["bank.row_bank"](), value: account.bankName},
    {label: m["bank.row_number"](), value: account.accountNumber},
    {label: m["bank.row_name"](), value: account.accountName},
  ];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="top-auto bottom-0 left-0 w-full max-w-none translate-x-0 translate-y-0 rounded-t-[32px] rounded-b-none px-6 pt-3 pb-[max(24px,env(safe-area-inset-bottom))]">
          <div className="mx-auto h-[7px] w-14 rounded-full bg-grey-300" aria-hidden="true" />
          <div className="mt-6 flex flex-col items-center">
            <span className="grid size-16 place-items-center rounded-full bg-grey-100">
              <img src={registeredIcon} alt="" className="h-6" />
            </span>
            <h2 className="mt-6 text-center text-[20px] font-bold">{m["bank.sheet_title"]()}</h2>
            <p className="mt-4 text-center text-[16px] leading-[22px] text-black/60">{m["bank.sheet_desc"]()}</p>
          </div>
          <div className="mt-6 flex flex-col gap-2 rounded-[12px] bg-[#f9f9f9] p-4">
            {rows.map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-[12px] text-grey-600">{row.label}</span>
                <span className="text-[14px]">{row.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-[50px] flex-1 rounded-[8px] bg-[#f2f2f2] text-[16px] font-medium text-primary-850"
            >
              {m["home.cancel"]()}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={pending}
              className="h-[50px] flex-1 rounded-[8px] bg-primary-500 text-[16px] font-medium text-white disabled:opacity-60"
            >
              {pending ? m["bank.requesting"]() : m["bank.request"]()}
            </button>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
