import {useState} from "react";
import {useNavigate} from "@tanstack/react-router";
import {CircleHelp, Copy, CreditCard, Headset, History, IdCard, MapPinned, ScrollText, Wallet} from "lucide-react";
import {AccountRow} from "@/components/account/account-row";
import {FaqSheet} from "@/components/account/faq-sheet";
import {useAccountQuery} from "@/queries/use-account-queries";
import type {WalletOverview} from "@/types/account-types";
import type {SimpleMessage} from "@/lib/i18n";
import {naira} from "@/lib/money";
import {m} from "@/paraglide/messages";

const PERSONAL_ROWS: {icon: typeof IdCard; label: SimpleMessage; to: "/account/personal" | "/account/addresses"}[] = [
  {icon: IdCard, label: "acct.personal_info", to: "/account/personal"},
  {icon: MapPinned, label: "acct.addresses", to: "/account/addresses"},
];

const LEGAL_ROWS: {icon: typeof CircleHelp; label: SimpleMessage; to?: "/account/help" | "/account/legal"; faq?: boolean}[] = [
  {icon: CircleHelp, label: "acct.faqs", faq: true},
  {icon: Headset, label: "acct.get_help", to: "/account/help"},
  {icon: ScrollText, label: "acct.legal", to: "/account/legal"},
];

/** The Account tab — sectioned nav rows, wallet balance + linked bank card, and the version footer. */
export function AccountPage() {
  const navigate = useNavigate();
  const query = useAccountQuery();
  const [faqs, setFaqs] = useState(false);
  const wallet = query.data?.wallet;

  return (
    <main className="flex h-dvh w-full flex-col gap-6 overflow-y-auto bg-white px-6 pb-[120px] pt-[60px]">
      <h1 className="text-[32px] font-bold leading-[1.1] tracking-[-0.32px] text-foreground">{m["acct.title"]()}</h1>
      <Section caption={m["acct.personal"]()}>
        {PERSONAL_ROWS.map((row) => (
          <AccountRow key={row.label} icon={row.icon} label={m[row.label]()} onClick={() => void navigate({to: row.to})} />
        ))}
      </Section>
      <Section caption={m["acct.financial"]()}>
        {query.isLoading ? (
          <div className="skeleton h-24 w-full rounded-[12px]" />
        ) : wallet ? (
          <WalletCard wallet={wallet} onOpen={() => void navigate({to: "/account/wallet"})} />
        ) : null}
        <AccountRow icon={CreditCard} label={m["acct.manage_card"]()} />
        <AccountRow icon={History} label={m["acct.history"]()} onClick={() => void navigate({to: "/account/transactions"})} />
      </Section>
      <Section caption={m["acct.legal_support"]()}>
        {LEGAL_ROWS.map(({icon, label, to, faq}) => {
          const onClick = faq ? () => setFaqs(true) : to ? () => void navigate({to}) : undefined;
          return <AccountRow key={label} icon={icon} label={m[label]()} onClick={onClick} />;
        })}
      </Section>
      <div className="mt-auto flex flex-col items-center pb-2">
        <span className="text-[14px] font-bold leading-[1.4] tracking-[0.14px] text-foreground">Alvo</span>
        <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500">{m["acct.version"]()}</span>
      </div>
      <FaqSheet open={faqs} onClose={() => setFaqs(false)} />
    </main>
  );
}

function Section({caption, children}: {caption: string; children: React.ReactNode}) {
  return (
    <section className="flex w-full flex-col gap-2">
      <h2 className="text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">{caption}</h2>
      <div className="flex w-full flex-col rounded-[16px] bg-[#f9f9f9] p-1">{children}</div>
    </section>
  );
}

function WalletCard({wallet, onOpen}: {wallet: WalletOverview; onOpen: () => void}) {
  return (
    <>
      <AccountRow
        icon={Wallet}
        label={`${m["acct.wallet"]()}:`}
        trailing={<span className="font-semibold text-foreground">{naira(wallet.balance)}</span>}
        onClick={onOpen}
      />
      {wallet.bank ? (
        <div className="mx-3 mb-3 flex flex-col gap-1 rounded-[12px] bg-primary-600 p-4">
          <div className="flex w-full items-center justify-between">
            <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-white/80">{wallet.bank.bankName}</span>
            <button
              type="button"
              onClick={() => void navigator.clipboard?.writeText(wallet.bank!.accountNumber).catch(() => undefined)}
              className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[12px] font-medium leading-[1.4] tracking-[0.12px] text-white"
            >
              {m["send.copy"]()}
              <Copy className="size-3.5" aria-hidden="true" />
            </button>
          </div>
          <span className="text-[18px] font-bold leading-[1.3] tracking-[0.18px] text-white">{wallet.bank.accountNumber}</span>
        </div>
      ) : null}
    </>
  );
}
