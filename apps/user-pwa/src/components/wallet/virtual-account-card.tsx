import {Copy} from "lucide-react";
import type {VirtualAccount} from "@/types/account-types";
import {m} from "@/paraglide/messages";

interface VirtualAccountCardProps {
  account: VirtualAccount | null;
  /** Opens the Generate Virtual Account sheet. */
  onGenerate: () => void;
}

/** The grey "Your virtual account" card — account details, or the generate prompt when none exists. */
export function VirtualAccountCard({account, onGenerate}: VirtualAccountCardProps) {
  return (
    <div className="flex w-full flex-col gap-2 rounded-[16px] bg-[#f9f9f9] p-4">
      <div className="flex w-full items-center justify-between">
        <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500">{m["wal.virtual"]()}</span>
        {account ? (
          <button
            type="button"
            onClick={() => void navigator.clipboard?.writeText(account.number).catch(() => undefined)}
            className="flex items-center gap-1 text-[12px] font-medium leading-[1.4] tracking-[0.12px] text-primary-500"
          >
            {m["wal.tap_copy"]()}
            <Copy className="size-3.5" aria-hidden="true" />
          </button>
        ) : (
          <button type="button" onClick={onGenerate} className="text-[12px] font-medium leading-[1.4] tracking-[0.12px] text-primary-500">
            {m["wal.generate"]()}
          </button>
        )}
      </div>
      {account ? (
        <>
          <span className="text-[20px] font-bold leading-[1.2] tracking-[0.2px] text-foreground">{account.number}</span>
          <span className="w-fit rounded-[6px] bg-grey-200 px-2 py-1 text-[10px] leading-[1.4] tracking-[0.1px] text-grey-600">
            {account.accountName}
          </span>
        </>
      ) : (
        <span className="text-[20px] font-bold leading-[1.2] tracking-[0.2px] text-foreground" aria-label={m["wal.virtual"]()}>
          ●●●●●●●●●●
        </span>
      )}
    </div>
  );
}
