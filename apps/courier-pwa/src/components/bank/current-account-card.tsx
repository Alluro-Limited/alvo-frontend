import {m} from "@/paraglide/messages";
import type {BankAccount} from "@/types/earnings-types";

/** The teal "Current Account" summary card at the top of Update Bank Account. */
export function CurrentAccountCard({account}: {account: BankAccount}) {
  return (
    <section className="flex flex-col gap-2 rounded-[8px] bg-[#00655a] p-4 text-white">
      <p className="text-[10px] font-medium">{m["bank.current"]()}</p>
      <div>
        <p className="text-[18px] leading-[22px] font-medium">{account.accountNumber}</p>
        <p className="flex items-center gap-1 text-[12px] font-medium">
          {account.accountName}
          <span aria-hidden="true" className="font-bold">
            •
          </span>
          {account.bankName}
        </p>
      </div>
    </section>
  );
}
